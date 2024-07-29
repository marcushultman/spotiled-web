import { Handlers, PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";
import BrightnessSlider from "../islands/BrightnessSlider.tsx";
import SpotifyAuthToggle from "../islands/SpotifyAuthToggle.tsx";
import SpotifyTokens, { Token } from "../islands/SpotifyTokens.tsx";
import { listFixtures } from "../src/sports.ts";
import moment from "npm:moment";

type Fixtures = NonNullable<Awaited<ReturnType<typeof listFixtures>>>;
type FixtureResponse = Fixtures["response"][0];

interface Data {
  brightness: string;
  hue: string;
  spotify: {
    isAuthenticating: boolean;
    tokens: [Token];
  };
  fixtures?: Fixtures;
  states: Record<string, string | undefined>;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const data = req.headers.get("x-spotiled");
    if (!data) {
      return ctx.renderNotFound();
    }
    return ctx.render({ ...JSON.parse(atob(data)), fixtures: await listFixtures() });
  },
};

// todo: make an island
function FootballFixture({ response, enabled }: { response: FixtureResponse; enabled: boolean }) {
  const { teams: { home, away }, goals, fixture: { id: fixtureId, date, status } } = response;
  const id = `/led/sports/${fixtureId}`;

  return (
    <form method="post" action={`${id}?toggle`}>
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

export default function Home(
  {
    data: {
      brightness,
      hue,
      spotify: { isAuthenticating, tokens },
      fixtures,
      states,
    },
  }: PageProps<Data>,
) {
  const leagueById = fixtures
    ? Object.fromEntries(fixtures.response.map(({ league }) => [league.id, league]))
    : {};

  const leagueFixtures = fixtures
    ? Object.entries(Object.groupBy(fixtures.response, (res) => res.league.id))
      .map(([leagueId, res]) => [leagueById[leagueId], res] as const)
    : null;

  return (
    <div class="p-4 mx-auto">
      <div class="flex(& col) gap-4">
        <h1 class="text-lg font-bold self-center">SpotiLED</h1>
        <div class="self-stretch flex(& col) gap-4 px-2 py-4 border-1 rounded-lg">
          <BrightnessSlider {...{ brightness, hue }} />
        </div>

        <SpotifyAuthToggle isAuthenticating={useSignal(isAuthenticating)} />
        <SpotifyTokens tokens={useSignal(tokens)} />

        <form
          class="self-stretch flex gap-2"
          method="post"
          action={"/text"}
        >
          <input class="flex-1 border-1" name="text" placeholder="" />
          <input class="px-4 py-2 rounded-full" type="submit" value="Send" />
        </form>

        <form method="post" action={`/led/flag`}>
          <button class="w-full" type="submit">Flag</button>
        </form>

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

        <form method="post" action={`/led/spv2`}>
          <button class="w-full" type="submit">SPv2</button>
        </form>
      </div>
    </div>
  );
}
