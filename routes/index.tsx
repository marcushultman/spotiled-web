import { Handlers, PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";
import BrightnessSlider from "../islands/BrightnessSlider.tsx";
import SpotifyAuthToggle from "../islands/SpotifyAuthToggle.tsx";
import SpotifyTokens, { Token } from "../islands/SpotifyTokens.tsx";
import { listFixtures } from "../src/sports.ts";

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

function FootballFixture(
  { response, data }: { response: FixtureResponse; data?: string },
) {
  const { teams: { home, away }, goals, fixture: { id } } = response;

  const teamLabel = (name: string, goals: number | null) => (
    <div class="flex-1 text-center">
      <div>{name}</div>
      <div class="text-lg font-bold">{goals}</div>
    </div>
  );

  return (
    <form
      id={`/led/sports/${id}`}
      method="post"
      action={`/led/sports/${id}${data ? "?abort" : ""}`}
      className={data ? "bg-red-100" : ""}
    >
      {data && <input type="hidden" name="data" value={data} />}
      <button class="w-full" type="submit">
        <div class="flex-1 flex gap-4 items-center">
          <img class="w-6 h-5" src={home.logo} />
          {teamLabel(home.name, goals.home)}
          <span>vs</span>
          {teamLabel(away.name, goals.away)}
          <img class="w-6 h-5" src={away.logo} />
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
                  <FootballFixture response={res} data={states[`/led/sports/${res.fixture.id}`]} />
                )),
              ]),
            leagueFixtures.length > 5
              ? (
                <button className="self-center px-8 py-2 bg-gray-300 rounded-full">
                  Show {leagueFixtures.length - 5} leagues...
                </button>
              )
              : null,
          ]
          : <>No sport games playing</>}

        <form method="post" action={`/led/spv2`}>
          <button class="w-full" type="submit">SPv2</button>
        </form>
      </div>
    </div>
  );
}
