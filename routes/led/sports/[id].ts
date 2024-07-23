import { Handlers } from "$fresh/server.ts";

import { encode } from "$std/encoding/base64.ts";
import { makeDisplay } from "../../../src/rendering.ts";
import { encodeState, makeResponse } from "../../../src/state.ts";
import { getFixtureAndLineup } from "../../api/sports.ts";
import { decodeServiceRequest } from "../../../src/state.ts";

interface Data {
  visible?: boolean;
}

function toHex([r, g, b]: Uint8Array) {
  return `#${[r, g, b].map((b) => b.toString(16)).join("")}`;
}

export const handler: Handlers = {
  async POST(req, routeCtx) {
    const url = new URL(req.url);
    const id = url.pathname.slice(1);
    const { data: { visible } } = await decodeServiceRequest<Data>(req, {});

    // Toggle visibility
    if (visible) {
      console.log(`Hide ${id}`);
      return makeResponse({ [id]: null });
    }

    const fixtureAndLineup = await getFixtureAndLineup(routeCtx.params.id, false);

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

    const now = Date.now();
    const date = new Date(fixture.date).getTime();

    // Game not yet started
    if (date >= now || goals.home == null || goals.away == null) {
      const poll = Math.max(0, Math.min(date - now, 60 * 60 * 1000)); // check back in 1h
      console.log(`${status.long} ${fixture.date} (wait ${poll / (60 * 1000)} minutes)`);
      return makeResponse({ [id]: encodeState(undefined, undefined, { poll }) });
    }

    const teamColors = new Map(
      lineup.response
        .map(({ team: { id, colors: { player: { primary: hexColor } } } }) => {
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

    console.log(`${status.long} ${home.name} - ${away.name} (${goals.home} - ${goals.away})`);
    return makeResponse({
      [id]: encodeState<Data>(
        { visible: true },
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
