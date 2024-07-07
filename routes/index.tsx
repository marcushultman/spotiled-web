import { Handlers, PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";
import BrightnessSlider from "../islands/BrightnessSlider.tsx";
import SpotifyAuthToggle from "../islands/SpotifyAuthToggle.tsx";
import SpotifyTokens, { Token } from "../islands/SpotifyTokens.tsx";
import { FIXTURE, LINEUP } from "../src/sports_data.ts";

interface Data {
  brightness: string;
  hue: string;
  spotify: {
    isAuthenticating: boolean;
    tokens: [Token];
  };
  fixture?: typeof FIXTURE;
  lineup?: typeof LINEUP;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const data = req.headers.get("x-spotiled");
    if (!data) {
      return ctx.renderNotFound();
    }

    const res = await fetch(new URL("/api/sports", ctx.url), {
      headers: { "accept": "application/json" },
    });
    return ctx.render({ ...JSON.parse(atob(data)), ...res.ok ? await res.json() : {} });
  },
};

function FootballFixture({ fixture, lineup }: { fixture: typeof FIXTURE; lineup: typeof LINEUP }) {
  const { teams: { home, away }, goals } = fixture.response[0];

  const findTeamColor = (id: number) =>
    lineup.response.find(({ team }) => team.id === id)?.team.colors.player.primary;

  const teamColor = (id: number) => <div class={`w-4 bg-[#${findTeamColor(id)}]`} />;
  const teamLabel = (name: string, goals: number) => (
    <div class="flex-1 text-center">
      <div>{name}</div>
      <div class="text-lg font-bold">{goals}</div>
    </div>
  );
  return (
    <form method="post" action="/ui/api/sports">
      <button class="w-full" type="submit">
        <div class="flex-1 flex gap-4">
          {teamColor(home.id)}
          {teamLabel(home.name, goals.home)}
          <div>vs</div>
          {teamLabel(away.name, goals.away)}
          {teamColor(away.id)}
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
      fixture,
      lineup,
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

        {fixture && lineup
          ? (
            <>
              <h1 class="text-center text-xl mb-2">UEFA</h1>
              <FootballFixture {...{ fixture, lineup }} />
            </>
          )
          : <>No sport games playing</>}

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
