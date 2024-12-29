import { Handlers } from "$fresh/server.ts";
import { encode } from "$std/encoding/base64.ts";
import { parseData } from "../../src/state.ts";
import { makeResponse, makeState, Prio } from "../../src/state.ts";
import { timeOfDayBrightness } from "../../src/time_of_day_brightness.ts";
import { createCanvas, encodeCanvas } from "../../src/rendering.ts";

enum Stage {
  VALUE = 1,
  DAY,
}

const API_KEY = Deno.env.get("TICKER_API_KEY");
const makeAPIUrl = (symbol: string) =>
  `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

async function toEntry(res: Response) {
  const data = await res.json();
  const quote = data["Global Quote"];
  return {
    symbol: quote["01. symbol"],
    value: Number(quote["05. price"]),
    day: Number(quote["09. change"]),
  };
}

type Data = Record<string | number | symbol, never> | {
  stage: Stage;
  entry: Awaited<ReturnType<typeof toEntry>>;
};

const canvas = createCanvas(23, 16);
let isFontRegistered = false;

export const handler: Handlers = {
  POST: async (req) => {
    const data = await parseData<Data>(req, {});
    const { stage, entry } = "stage" in data ? (++data.stage, data) : await (async () => {
      const url = new URL(req.url);
      const symbols = [...url.searchParams.keys()];

      if (!symbols.length) {
        return {};
      }
      const [entry] = await Promise.all(
        symbols.map((symbol) => fetch(makeAPIUrl(symbol)).then(toEntry)),
      );
      return { stage: Stage.VALUE, entry };
    })();

    if (!isFontRegistered) {
      const res = await fetch(new URL("/static/enter-the-gungeon-big.ttf", req.url));
      canvas.loadFont(await res.bytes(), { family: "7px" });
      isFontRegistered = true;
    }

    if (!stage || stage > Stage.DAY) {
      return makeResponse({ "/led/ticker": null });
    }

    const kv = await Deno.openKv();
    const { value } = await kv.get<{ brightness: number; hue: number }>(["settings"]);
    const { brightness = 31, hue = 255 } = value ?? {};

    const color = timeOfDayBrightness({ brightness, hue });
    const [r, g, b] = color;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "9px 7px";
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillText(entry.symbol, 0, 7);
    ctx.fillText(stage === Stage.VALUE ? `$${entry.value}` : `$${entry.day}`, 0, 15);

    return makeResponse({
      "/led/ticker": makeState<Data>({
        data: { stage, entry },
        display: {
          logo: encode(new Uint8Array(color)),
          bytes: encodeCanvas(canvas),
          prio: Prio.NOTIFICATION,
        },
        poll: 2500,
      }),
    });
  },
};
