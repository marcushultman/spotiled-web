// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_joke from "./routes/api/joke.ts";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $led_flag from "./routes/led/flag.ts";
import * as $led_sports_id_ from "./routes/led/sports/[id].ts";
import * as $led_spv2 from "./routes/led/spv2.ts";
import * as $led_text from "./routes/led/text.ts";
import * as $ping from "./routes/ping.ts";
import * as $timeout_path_ from "./routes/timeout/[...path].ts";
import * as $BrightnessSlider from "./islands/BrightnessSlider.tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $SpotifyAuthToggle from "./islands/SpotifyAuthToggle.tsx";
import * as $SpotifyTokens from "./islands/SpotifyTokens.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/joke.ts": $api_joke,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
    "./routes/led/flag.ts": $led_flag,
    "./routes/led/sports/[id].ts": $led_sports_id_,
    "./routes/led/spv2.ts": $led_spv2,
    "./routes/led/text.ts": $led_text,
    "./routes/ping.ts": $ping,
    "./routes/timeout/[...path].ts": $timeout_path_,
  },
  islands: {
    "./islands/BrightnessSlider.tsx": $BrightnessSlider,
    "./islands/Counter.tsx": $Counter,
    "./islands/SpotifyAuthToggle.tsx": $SpotifyAuthToggle,
    "./islands/SpotifyTokens.tsx": $SpotifyTokens,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
