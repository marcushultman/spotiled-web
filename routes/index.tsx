import { Handlers, PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";
import BrightnessSlider from "../islands/BrightnessSlider.tsx";
import SpotifyAuthToggle from "../islands/SpotifyAuthToggle.tsx";
import SpotifyTokens, { Token } from "../islands/SpotifyTokens.tsx";

interface Data {
  brightness: string;
  hue: string;
  spotify: {
    isAuthenticating: boolean;
    tokens: [Token];
  };
}

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const data = req.headers.get("x-spotiled");
    return data ? ctx.render(JSON.parse(atob(data))) : ctx.renderNotFound();
  },
};

export default function Home(
  { data: { brightness, hue, spotify: { isAuthenticating, tokens } } }: PageProps<Data>,
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
      </div>
    </div>
  );
}
