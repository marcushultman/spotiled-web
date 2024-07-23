import { Handlers, PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";
import BrightnessSlider from "../islands/BrightnessSlider.tsx";
import SpotifyAuthToggle from "../islands/SpotifyAuthToggle.tsx";
import SpotifyTokens, { Token } from "../islands/SpotifyTokens.tsx";
import { listFixtures } from "./api/sports.ts";
import * as moment from "npm:moment";

interface Data {
  brightness: string;
  hue: string;
  spotify: {
    isAuthenticating: boolean;
    tokens: [Token];
  };
  fixtures: Awaited<ReturnType<typeof listFixtures>>;
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

type FixtureResponse = NonNullable<Awaited<ReturnType<typeof listFixtures>>>["response"][0];

function FootballFixture(
  { response, data }: { response: FixtureResponse; data?: string },
) {
  const { teams: { home, away }, goals, fixture: { id } } = response;

  // const findTeamColor = (id: number) =>  lineup.response.find(({ team }) => team.id === id)?.team.colors.player.primary;

  const teamLabel = (name: string, goals: number | null) => (
    <div class="flex-1 text-center">
      <div>{name}</div>
      <div class="text-lg font-bold">{goals}</div>
    </div>
  );
  return (
    <form method="post" action={`/led/sports/${id}`} id={`led/sports/${id}`}>
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

        {fixtures?.results
          ? [
            <h1 class="text-center text-xl mb-2">UEFA</h1>,
            Object.entries(
              Object.groupBy(fixtures.response, (res) => res.fixture.date.slice(0, 10)),
            )
              .map(([date, res]) => [
                <div class="text-center bg-gray-200 rounded-full">
                  {moment.default(date).calendar()}
                </div>,
                res?.map((res) => (
                  <FootballFixture response={res} data={states[`led/sports/${res.fixture.id}`]} />
                )),
              ]),
          ]
          : <>No sport games playing</>}

        <form method="post" action={`/led/spv2`}>
          <button class="w-full" type="submit">SPv2</button>
        </form>

        {
          /* <form class="self-stretch flex items-center gap-2" method="post" action="/ui/api/sports">
          <input class="" type="radio" name="mode" value="true" />
          <label for="html">ON</label>
          <input class="" type="radio" name="mode" value="false" />
          <label for="html">OFF</label>
          <input class="px-4 py-2 rounded-full" type="submit" value="Poopy" />
        </form> */
        }
      </div>
    </div>
  );
}
