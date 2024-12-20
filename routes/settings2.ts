import { Handlers } from "$fresh/server.ts";
import { encode } from "$std/encoding/base64.ts";
import { createCanvas, encodeCanvas } from "../src/rendering.ts";
import { decodeServiceRequest, Prio } from "../src/state.ts";
import { makeState } from "../src/state.ts";
import { makeResponse } from "../src/state.ts";
import { Color, timeOfDayBrightness } from "../src/time_of_day_brightness.ts";

interface Data {
  brightness?: number;
  hue?: number;
}

const parseNumber = (n: string | null) => n ? Number(n) : undefined;

const CANVAS = createCanvas(23, 16);

// deno-fmt-ignore
const LENGTHS = [
  [ 1, 1 ], [ 4, 4 ], [ 2, 2 ],
  [ 2, 2 ], [ 1, 1 ], [ 2, 2 ],
  [ 8, 8 ], [ 6, 6 ], [ 6, 6 ],
  [ 4, 4 ], [ 8, 8 ], [ 8, 8 ],
  [ 3, 3 ], [ 3, 3 ], [ 8, 8 ],
  [ 8, 8 ], [ 7, 7 ], [ 4, 4 ],
  [ 5, 5 ], [ 2, 2 ], [ 7, 7 ],
  [ 6, 6 ], [ 1, 1 ]
];

function makeDisplay(brightness: number, color: Color) {
  const ctx = CANVAS.getContext("2d");
  ctx.clearRect(0, 0, 23, 16);
  const [r, g, b] = color;
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  const end = 23 * (brightness ?? 0) / 64;
  LENGTHS.slice(0, end).forEach(([l0, l1], x) => ctx.fillRect(x, 8 - l0, 1, l0 + l1));
  return encodeCanvas(CANVAS);
}

export const handler: Handlers = {
  async POST(req) {
    let { data: { brightness = 1, hue = 255 } } = await decodeServiceRequest<Data>(req, {});
    const { searchParams } = new URL(req.url);
    [brightness, hue] = [
      parseNumber(searchParams.get("brightness")) ?? brightness,
      parseNumber(searchParams.get("hue")) ?? hue,
    ];

    const kv = await Deno.openKv();
    await kv.set(["settings"], { brightness, hue });

    const color = timeOfDayBrightness({ brightness, hue });

    return makeResponse({
      "/settings2": null,
      ...searchParams.size
        ? {
          "/settings2/ui": makeState({
            display: {
              logo: encode(new Uint8Array(color)),
              bytes: makeDisplay(brightness, color),
              prio: Prio.NOTIFICATION,
            },
            timeout: 3000,
          }),
        }
        : {},
    });
  },
};
