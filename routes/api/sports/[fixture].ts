import { RouteContext } from "$fresh/server.ts";
import { createCanvas, EmulatedCanvas2D } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { transpose } from "../../../src/transpose.ts";
import { getFixtureAndLineup } from "../sports.ts";

function makeCanvas() {
  return createCanvas(23, 16);
}

function bufferFromCanvas(canvas: EmulatedCanvas2D) {
  return transpose(23, canvas.getRawBuffer(0, 0, 23, 16));
}

export default async function Fixture(_: Request, routeCtx: RouteContext): Promise<Response> {
  const { fixture, lineup } = await getFixtureAndLineup(routeCtx.params.fixture) ?? {};

  console.log({ fixture, lineup });
  if (!fixture || !lineup) {
    return routeCtx.renderNotFound();
  }
  const { response: [{ fixture: { date }, teams: { home, away }, goals }] } = fixture;

  const teamColors = new Map(
    lineup.response.map(({ team }) => [team.id, `#${team.colors.player.primary}`] as const),
  );
  const [homeColor, awayColor] = [teamColors.get(home.id), teamColors.get(away.id)];

  const canvas = makeCanvas();
  const ctx = canvas.getContext("2d");

  const untilStart = new Date(date).getTime() - Date.now();
  if (untilStart > 0 && untilStart < 60 * 60 * 1000) {
    // 1H left
    ctx.scale(0.5, 1);
    ctx.fillStyle = "white";
    ctx.font = "12px monospace";
    ctx.fillText(`${Math.round(untilStart / (60 * 1000))} min`, 3 / 0.5, 12);
    return new Response(bufferFromCanvas(canvas), { headers: { "x-spotiled-logo": "ffffff" } });
  }

  if (goals.home === null || goals.away === null || !homeColor || !awayColor) {
    return routeCtx.renderNotFound();
  }

  ctx.fillStyle = homeColor;
  ctx.fillRect(0, 0, 2, 16);
  ctx.fillStyle = awayColor;
  ctx.fillRect(21, 0, 2, 16);

  ctx.scale(0.5, 1);
  ctx.fillStyle = "white";
  ctx.font = "16px monospace";
  ctx.fillText(goals.home.toString(), 3 / 0.5, 14);
  ctx.fillText(goals.away.toString(), 15 / 0.5, 14);

  const logoColor = goals.home > goals.away
    ? homeColor.slice(1)
    : goals.home < goals.away
    ? awayColor.slice(1)
    : "ffffff";

  return new Response(bufferFromCanvas(canvas), { headers: { "x-spotiled-logo": logoColor } });
}
