import { Handlers } from "$fresh/server.ts";
import { encode } from "$std/encoding/base64.ts";
import { createCanvas, encodeCanvas } from "../src/rendering.ts";
import { decodeServiceRequest, Prio } from "../src/state.ts";
import { encodeState } from "../src/state.ts";
import { makeResponse } from "../src/state.ts";

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

function makeDisplay(brightness = 0) {
  const ctx = CANVAS.getContext("2d");
  ctx.clearRect(0, 0, 23, 16);
  ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
  const end = 23 * (brightness ?? 0) / 64;
  LENGTHS.slice(0, end).forEach(([l0, l1], x) => ctx.fillRect(x, 8 - l0, 1, l0 + l1));
  return encodeCanvas(CANVAS);
}

export const handler: Handlers = {
  async POST(req) {
    let { data: { brightness, hue } } = await decodeServiceRequest<Data>(req, {});
    const { searchParams } = new URL(req.url);
    [brightness, hue] = [
      parseNumber(searchParams.get("brightness")) ?? brightness,
      parseNumber(searchParams.get("hue")) ?? hue,
    ];

    const kv = await Deno.openKv();
    await kv.set(["settings"], { brightness, hue });

    return makeResponse({
      "/settings2": null,
      ...searchParams.size
        ? {
          "/settings2/ui": encodeState(undefined, {
            logo: encode(new Uint8Array([brightness ?? 0, brightness ?? 0, brightness ?? 0])),
            bytes: makeDisplay(brightness),
            prio: Prio.NOTIFICATION,
          }, { timeout: 3000 }),
        }
        : {},
    });
  },
};
