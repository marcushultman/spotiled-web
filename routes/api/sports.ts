import { FreshContext } from "$fresh/server.ts";
import { FIXTURES, LINEUP } from "../../src/sports_data.ts";

// const SCHEDULED = ["TBD", "NS"];
// const FINISHED = ["FT", "AET", "PEN"];
// const MISC = ["PST", "CANC", "ABD", "AWD", "WO"];

// const NOT_PLAYING = [...SCHEDULED, ...FINISHED, ...MISC];

const API = "https://v3.football.api-sports.io";
const API_CACHE = "caches" in window ? await caches.open(API) : undefined;
const REQ_INIT = { headers: { "x-apisports-key": "4c470321f1e01c39d3b2df384f67c7c7" } };

async function fetchWithCache(req: Request, refresh = false) {
  let res = await API_CACHE?.match(req);
  const cacheHit = res !== undefined;

  if (!res || refresh) {
    console.info(`refreshing ${req.url}...`);
    res = await fetch(req);
    if (res.ok) {
      await API_CACHE?.put(req, res.clone());
    }
  }
  return [res, cacheHit] as const;
}

export async function listFixtures() {
  const d = new Date();
  const from = d.toISOString().substring(0, 10);
  d.setDate(d.getDate() + 7);
  const to = d.toISOString().substring(0, 10);

  const req = new Request(`${API}/fixtures?league=4&season=2024&from=${from}&to=${to}`, REQ_INIT);
  const [res, cacheHit] = await fetchWithCache(req);

  if (!res.ok) {
    return undefined;
  }

  const fixtures = await res.json() as typeof FIXTURES;

  if (!cacheHit) {
    console.log(fixtures);
  }

  return fixtures;
}

export async function getFixtureAndLineup(id: string, refresh = false) {
  const [[fixtureRes], [lineupRes]] = await Promise.all([
    fetchWithCache(new Request(`${API}/fixtures?id=${id}`, REQ_INIT), refresh),
    fetchWithCache(new Request(`${API}/fixtures/lineups?fixture=${id}`, REQ_INIT), refresh),
  ]);

  if (!fixtureRes.ok || !lineupRes.ok) {
    return undefined;
  }

  const [fixture, lineup] = await Promise.all([
    await fixtureRes.json() as typeof FIXTURES,
    await lineupRes.json() as typeof LINEUP,
  ]);

  return { fixture, lineup };
}

export const handler = async (_: Request, ctx: FreshContext): Promise<Response> => {
  return ctx.renderNotFound();
};
