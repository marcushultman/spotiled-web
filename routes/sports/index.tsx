import { defineRoute } from "$fresh/server.ts";
import { listFixtures } from "../../src/sports.ts";
import moment from "npm:moment";

type Fixtures = NonNullable<Awaited<ReturnType<typeof listFixtures>>>;
type FixtureResponse = Fixtures["response"][0];

// todo: make an island
function FootballFixture({ response, enabled }: { response: FixtureResponse; enabled: boolean }) {
  const { teams: { home, away }, goals, fixture: { id: fixtureId, date, status } } = response;
  const id = `/led/sports/${fixtureId}`;

  return (
    <form method="post" action={`${id}?FAF&toggle`}>
      <button
        className={`w-full hover:bg-gray-100 p-2 flex gap-2 items-stretch h-28 ${
          enabled ? "bg-red-400" : ""
        }`}
        type="submit"
      >
        <div class={`flex-1 flex flex-col`}>
          <div class="flex-1 flex items-center">
            <img class="w-6 h-5 m-2" src={home.logo} />
            <div class="flex-1 text-left">{home.name}</div>
            <div>{goals.home}</div>
          </div>
          <div class="flex-1 flex items-center">
            <img class="w-6 h-5 m-2" src={away.logo} />
            <div class="flex-1 text-left">{away.name}</div>
            <div>{goals.away}</div>
          </div>
        </div>

        {goals.home != null && goals.away != null && (
          <div class={`flex flex-col`}>
            <div class="flex-1 flex items-center">
              {(goals.home ?? 0) > (goals.away ?? 0) ? <div>◀︎</div> : null}
            </div>
            <div class="flex-1 flex items-center">
              {(goals.home ?? 0) < (goals.away ?? 0) ? <div>◀︎</div> : null}
            </div>
          </div>
        )}

        <div class="w-[1px] self-center h-5/6 bg-gray-300"></div>

        <div class="w-22 self-center text-sm text-center">
          <div>{status.short}</div>
          <div>{moment(date).fromNow()}</div>
        </div>
      </button>
    </form>
  );
}

export default defineRoute(async (req, ctx) => {
  const fixtures = await listFixtures();

  const data = req.headers.get("x-spotiled");
  if (!data) {
    return ctx.renderNotFound();
  }
  const states: Record<string, string | undefined> = JSON.parse(atob(data)).states;

  const leagueById = fixtures
    ? Object.fromEntries(fixtures.response.map(({ league }) => [league.id, league]))
    : {};

  const leagueFixtures = fixtures
    ? Object.entries(Object.groupBy(fixtures.response, (res) => res.league.id))
      .map(([leagueId, res]) => [leagueById[leagueId], res] as const)
    : null;

  return (
    <div>
      <div>
        {leagueFixtures
          ? [
            <h1 class="text-center text-xl mb-2">Sportboll</h1>,
            leagueFixtures
              .slice(0, 3)
              .map(([{ name, country }, res]) => [
                <div class="text-center bg-gray-200 rounded-full">
                  {name} {country !== "World" ? country : null}
                </div>,
                res?.slice(0, 5).map((res) => (
                  <FootballFixture
                    response={res}
                    enabled={`/led/sports/${res.fixture.id}` in states}
                  />
                )),
              ]),
          ]
          : <>No sport games playing</>}
      </div>
      {leagueFixtures && leagueFixtures.length > 5
        ? (
          <button className="self-center px-8 py-2 bg-gray-300 rounded-full">
            Show {leagueFixtures.length - 5} leagues...
          </button>
        )
        : null}
    </div>
  );
});
