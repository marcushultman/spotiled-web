import { FreshContext } from "$fresh/server.ts";
import { createCanvas, EmulatedCanvas2D } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { transpose } from "../../src/transpose.ts";
import { FIXTURE, LINEUP } from "../../src/sports_data.ts";

// const SCHEDULED = ["TBD", "NS"];
// const FINISHED = ["FT", "AET", "PEN"];
// const MISC = ["PST", "CANC", "ABD", "AWD", "WO"];

// const NOT_PLAYING = [...SCHEDULED, ...FINISHED, ...MISC];

const API = "https://v3.football.api-sports.io";
const REQ_INIT = { headers: { "x-apisports-key": "4c470321f1e01c39d3b2df384f67c7c7" } };

function makeCanvas() {
  return createCanvas(23, 16);
}

function bufferFromCanvas(canvas: EmulatedCanvas2D) {
  return transpose(23, canvas.getRawBuffer(0, 0, 23, 16));
}

export const handler = async (req: Request, _ctx: FreshContext): Promise<Response> => {
  let res = await fetch(`${API}/fixtures?league=4&season=2024&live=all`, REQ_INIT);
  const fixture = res.ok ? await res.json() as typeof FIXTURE : undefined;
  // const fixture = await FIXTURE;

  if (!fixture || !fixture.results) {
    console.info("sports: no fixtures live");
    return new Response(null, {
      status: 404,
      // headers: {
      //   'x-spotiled-retry-in': ...?
      // }
    });
  }
  const accept = req.headers.get("accept");

  const { response: [{ fixture: { id }, teams: { home, away }, goals }] } = fixture;

  res = await fetch(`${API}/fixtures/lineups?fixture=${id}`, REQ_INIT);
  const lineup = res.ok ? await res.json() as typeof LINEUP : undefined;
  // const lineup = await LINEUP;

  if (accept === "application/json") {
    return Response.json({ fixture, lineup });
  }

  const teamColors = new Map(
    lineup?.response.map(({ team }) => [team.id, `#${team.colors.player.primary}`] as const),
  );

  const homeColor = teamColors.get(home.id) ?? "#ffffff";
  const awayColor = teamColors.get(away.id) ?? "#ffffff";

  const canvas = makeCanvas();
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = homeColor;
  ctx.fillRect(0, 0, 2, 16);
  ctx.fillStyle = awayColor;
  ctx.fillRect(21, 0, 2, 16);

  ctx.scale(0.5, 1);
  ctx.fillStyle = "white";
  ctx.font = "16px monospace";
  ctx.fillText(goals.home.toString(), 3 / 0.5, 14);
  ctx.fillText(goals.away.toString(), 15 / 0.5, 14);

  if (accept === "text/url") {
    return new Response(canvas.toDataURL());
  }

  const logoColor = goals.home > goals.away
    ? homeColor.slice(1)
    : goals.home < goals.away
    ? awayColor.slice(1)
    : "ffffff";

  return new Response(bufferFromCanvas(canvas), { headers: { "x-spotiled-logo": logoColor } });
};
