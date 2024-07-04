import { FreshContext } from "$fresh/server.ts";
import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { transpose } from "../../src/transpose.ts";

const STATIC = {
  get: "fixtures",
  parameters: { league: "4", season: "2024", next: "1" },
  errors: [],
  results: 1,
  paging: { current: 1, total: 1 },
  response: [
    {
      fixture: {
        id: 1219688,
        referee: "A. Taylor",
        timezone: "UTC",
        date: "2024-07-05T16:00:00+00:00",
        timestamp: 1720195200,
        periods: { first: null, second: null },
        venue: { id: 20739, name: "Stuttgart Arena", city: "Stuttgart" },
        status: { long: "Not Started", short: "NS", elapsed: null },
      },
      league: {
        id: 4,
        name: "Euro Championship",
        country: "World",
        logo: "https://media.api-sports.io/football/leagues/4.png",
        flag: null,
        season: 2024,
        round: "Quarter-finals",
      },
      teams: {
        home: {
          id: 9,
          name: "Spain",
          logo: "https://media.api-sports.io/football/teams/9.png",
          winner: null,
        },
        away: {
          id: 25,
          name: "Germany",
          logo: "https://media.api-sports.io/football/teams/25.png",
          winner: null,
        },
      },
      goals: { home: null as null | number, away: null as null | number },
      score: {
        halftime: { home: null, away: null },
        fulltime: { home: null, away: null },
        extratime: { home: null, away: null },
        penalty: { home: null, away: null },
      },
    },
  ],
};

const SCHEDULED = ["TBD", "NS"];
const FINISHED = ["FT", "AET", "PEN"];
const MISC = ["PST", "CANC", "ABD", "AWD", "WO"];

const NOT_PLAYING = [...SCHEDULED, ...FINISHED, ...MISC];

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
  // const res = await fetch(
  //   "https://v3.football.api-sports.io/fixtures?league=4&season=2024&next=1",
  //   { headers: { "x-apisports-key": "4c470321f1e01c39d3b2df384f67c7c7" } },
  // );
  // const data = await res.json();
  const data: any = await STATIC;

  const {
    response: [
      {
        fixture: { status: { short: status } },
        teams: { home: { name: home }, away: { name: away } },
        goals: { home: homeGoals, away: awayGoals },
      },
    ],
  } = data;

  if (NOT_PLAYING.includes(status)) {
    // return new Response(null, { status: 404 });
  }

  const canvas = createCanvas(23, 16);

  const ctx = canvas.getContext("2d");
  ctx.scale(0.75, 1);

  ctx.font = "7px monospace";
  ctx.fillStyle = "white";
  ctx.fillText(home.slice(0, 3).toUpperCase(), 1 / 0.75, 6);
  ctx.fillText(away.slice(0, 3).toUpperCase(), 13 / 0.75, 15);

  ctx.font = "9px monospace";
  ctx.fillText((awayGoals ?? 1).toString(), 17 / 0.75, 8);
  ctx.fillText((homeGoals ?? 2).toString(), 1 / 0.75, 15);

  const buffer = canvas.getRawBuffer(0, 0, 23, 16);

  return new Response(transpose(23, buffer), {
    headers: {
      "x-spotiled-image-url": canvas.toDataURL("png"),
    },
  });
};
