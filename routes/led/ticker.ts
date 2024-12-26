import { Handlers } from "$fresh/server.ts";
import { encode } from "$std/encoding/base64.ts";
import { createCanvas, encodeCanvas } from "../../src/rendering.ts";
import { makeResponse, makeState, Prio } from "../../src/state.ts";

const API_KEY = Deno.env.get("TICKER_API_KEY");

async function toEntry(res: Response) {
  const data = await res.json();
  const quote = data["Global Quote"];
  return {
    symbol: quote["01. symbol"],
    value: Number(quote["05. price"]),
    day: Number(quote["09. change"]),
  };
}

let canvas = createCanvas(23, 16);

const CHAR_WIDTH = (() => {
  const ctx = canvas.getContext("2d");
  ctx.scale(0.8, 1);
  ctx.font = "14px monospace";
  return ctx.measureText(" ").width;
})();

export const handler: Handlers = {
  POST: async (req) => {
    const url = new URL(req.url);
    const symbols = [...url.searchParams.keys()];

    if (!symbols.length) {
      return makeResponse({ "/led/ticker": null });
    }

    const [entry] = await Promise.all(
      symbols.map((symbol) =>
        fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`,
        ).then(toEntry)
      ),
    );

    const kv = await Deno.openKv();
    const { value } = await kv.get<{ brightness: number }>(["settings"]);
    const { brightness = 31 } = value ?? {};

    const text = `${entry.symbol} ${entry.value} ${entry.day}`;
    const width = CHAR_WIDTH * (text.length + 1);
    const xscroll = 10;
    const timeout = width * 1000 / xscroll;

    if (width > canvas.width) {
      canvas = createCanvas(width, 16);
    }

    const ctx = canvas.getContext("2d");
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(0.8, 1);

    ctx.fillStyle = entry.day >= 0 ? `rgb(0,${brightness},0)` : `rgb(${brightness},0,0)`;
    ctx.font = "14px monospace";
    ctx.fillText(text, 0, 13);

    return makeResponse({
      "/led/ticker": makeState({
        display: {
          logo: encode(new Uint8Array([0xFF, 0xFF, 0xFF])),
          bytes: encodeCanvas(canvas, width),
          width,
          xscroll,
          prio: Prio.NOTIFICATION,
        },
        timeout,
      }),
    });
  },
};
