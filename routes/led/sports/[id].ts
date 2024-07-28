import { Handlers } from "$fresh/server.ts";

import { encode } from "$std/encoding/base64.ts";
import { makeDisplay } from "../../../src/rendering.ts";
import { encodeState, makeResponse } from "../../../src/state.ts";
import { getFixtureAndLineup } from "../../../src/sports.ts";
import { decodeServiceRequest } from "../../../src/state.ts";
import moment from "npm:moment";

interface Data {
  enabled: boolean;
}

function toHex([r, g, b]: Uint8Array) {
  return `#${[r, g, b].map((b) => b.toString(16)).join("")}`;
}

export const handler: Handlers = {
  async POST(req, routeCtx) {
    const url = new URL(req.url);
    const id = url.pathname;
    const { data: { enabled } } = await decodeServiceRequest<Data>(req, { enabled: false });

    if (enabled && url.searchParams.has("toggle")) {
      console.log(`${id}: hiding`);
      return makeResponse({ [id]: null });
    }

    const fixtureAndLineup = await getFixtureAndLineup(routeCtx.params.id);

    if (!fixtureAndLineup || fixtureAndLineup.fixture.results == 0) {
      for (const error of Object.values(fixtureAndLineup?.fixture.errors ?? {})) {
        console.error(error);
      }
      return makeResponse({ [id]: null });
    }

    const {
      fixture: { response: [{ fixture: { status, ...fixture }, teams: { home, away }, goals }] },
      lineup,
    } = fixtureAndLineup;
    const printLead = `${id}: ${status.long} ${home.name} vs ${away.name}`;

    const now = Date.now();
    const date = new Date(fixture.date).getTime();

    // Game not yet started
    if (date >= now) {
      const startsIn = date - now;
      console.log(`${printLead}: starts ${moment(date).from(now)}`);
      const poll = Math.min(startsIn, 60 * 60 * 1000); // check back in <= 1h
      return makeResponse({ [id]: encodeState<Data>({ enabled: true }, undefined, { poll }) });
    }

    // Game was not played..?
    if (goals.home == null || goals.away == null) {
      console.log(`${printLead}: game not played => hiding`);
      return makeResponse({ [id]: null });
    }

    const teamColors = new Map(
      lineup.response.map(({ team: { id, colors } }) => {
        const { player: { primary: hexColor = "ffffff" } = {} } = colors ?? {};
        const [r, g, b] = (hexColor.match(/.{2}/g) ?? []).map((hex) => parseInt(hex, 16));
        return [id, new Uint8Array([r, g, b])] as const;
      }),
    );

    const [homeColor, awayColor] = [teamColors.get(home.id), teamColors.get(away.id)];
    const logoColor =
      (goals.home > goals.away ? homeColor : goals.home < goals.away ? awayColor : undefined) ??
        new Uint8Array([0xff, 0xff, 0xff]);

    const poll = ({
      "1H": 1 * 60 * 1000,
      "HT": 5 * 60 * 1000,
      "2H": 1 * 60 * 1000,
      "ET": 1 * 60 * 1000,
      "BT": 1 * 60 * 1000,
      "P": 30 * 1000,
    })[status.short];

    if (!poll && enabled) {
      console.log(`${printLead}: timeout => hiding`);
      return makeResponse({ [id]: null });
    }

    console.log(`${printLead}: ${goals.home} - ${goals.away}`);
    return makeResponse({
      [id]: encodeState<Data>(
        { enabled: true },
        {
          logo: encode(logoColor),
          bytes: makeDisplay((ctx) => {
            ctx.fillStyle = homeColor ? toHex(homeColor) : "#ff0000";
            ctx.fillRect(0, 0, 2, 16);
            ctx.fillStyle = awayColor ? toHex(awayColor) : "#0000ff";
            ctx.fillRect(21, 0, 2, 16);

            ctx.scale(0.5, 1);
            ctx.fillStyle = "white";
            ctx.font = "16px monospace";
            ctx.fillText(goals.home.toString(), 3 / 0.5, 14);
            ctx.fillText(goals.away.toString(), 15 / 0.5, 14);
          }),
        },
        { poll: poll || 5000 },
      ),
    });
  },
};
