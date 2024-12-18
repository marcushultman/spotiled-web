import { Handlers, PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";
import BrightnessSlider from "../islands/BrightnessSlider.tsx";
import SpotifyAuthToggle from "../islands/SpotifyAuthToggle.tsx";
import SpotifyTokens from "../islands/SpotifyTokens.tsx";
import { parseData } from "../src/spv2.ts";

interface Data {
  states: Record<string, string | undefined>;
  deviceID?: string;
  brightness: number;
  hue: number;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const data = req.headers.get("x-spotiled");
    const deviceID = req.headers.get("x-device-id") ?? undefined;
    if (!data) {
      return ctx.renderNotFound();
    }
    const kv = await Deno.openKv();
    const { value } = await kv.get<{ brightness: number; hue: number }>(["settings"]);
    const { brightness = 31, hue = 255 } = value ?? {};
    return ctx.render({ ...JSON.parse(atob(data)), deviceID, brightness, hue });
  },
};

export default function Home({ data: { states, deviceID, brightness, hue } }: PageProps<Data>) {
  const { auth, tokens = [] } = parseData(states["/led/spv2"]);
  return (
    <div class="p-4 mx-auto">
      <div class="flex(& col) gap-4">
        <h1 class="text-lg font-bold self-center">{deviceID ?? "SpotiLED"}</h1>
        <div class="self-stretch flex(& col) gap-4 px-2 py-4 border-1 rounded-lg">
          <BrightnessSlider {...{ brightness, hue }} />
        </div>

        <SpotifyAuthToggle isAuthenticating={useSignal(auth !== undefined)} />
        <SpotifyTokens tokens={useSignal(tokens)} />

        <form class="self-stretch flex gap-2" method="post" action={"/led/text"}>
          <input class="flex-1 border-1" name="text" placeholder="" />
          <input class="px-4 py-2 rounded-full" type="submit" value="Send" />
        </form>

        <form method="post" action={`/led/flag`}>
          <button class="w-full" type="submit">Flag</button>
        </form>

        <a href="/sports">Sportboll</a>
      </div>
    </div>
  );
}
