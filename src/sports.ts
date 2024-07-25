import { FIXTURES, LINEUP } from "./sports_data.ts";

const API = "https://v3.football.api-sports.io";
const API_CACHE = "caches" in window ? await caches.open(API) : undefined;
const REQ_INIT = { headers: { "x-apisports-key": "4c470321f1e01c39d3b2df384f67c7c7" } };

async function fetchWithCache(input: RequestInfo | URL, init?: RequestInit | undefined) {
  const req = new Request(input, init);
  let res = await API_CACHE?.match(req);

  if (!res) {
    console.info(`refreshing ${req.url}...`);
    res = await fetch(req);
    if (res.ok) {
      await API_CACHE?.put(req, res.clone());
    }
  }
  return res;
}

export async function listFixtures(date = new Date()) {
  const res = await fetchWithCache(
    `${API}/fixtures?date=${date.toISOString().substring(0, 10)}`,
    REQ_INIT,
  );
  return res.ok ? await res.json() as typeof FIXTURES : undefined;
}

export async function getFixtureAndLineup(id: string) {
  const toJSON = <T>(res: Response) => res.ok ? res.json() as T : undefined;

  const [fixture, lineup] = await Promise.all([
    fetch(`${API}/fixtures?id=${id}`, REQ_INIT).then(toJSON<typeof FIXTURES>),
    fetchWithCache(`${API}/fixtures/lineups?fixture=${id}`, REQ_INIT).then(toJSON<typeof LINEUP>),
  ]);
  return fixture && lineup && { fixture, lineup };
}
