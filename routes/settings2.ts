import { Handlers } from "$fresh/server.ts";
import { encode } from "$std/encoding/base64.ts";
import { createCanvas, encodeCanvas } from "../src/rendering.ts";
import { decodeServiceRequest } from "../src/state.ts";
import { encodeState } from "../src/state.ts";
import { makeResponse } from "../src/state.ts";

interface Data {
  brightness?: number;
  hue?: number;
}

const parseNumber = (n: string | null) => n ? Number(n) : undefined;

const CANVAS = createCanvas(23, 16);

export const handler: Handlers = {
  async POST(req) {
    let { data: { brightness, hue } } = await decodeServiceRequest<Data>(req, {});
    const { searchParams } = new URL(req.url);
    [brightness, hue] = [
      parseNumber(searchParams.get("brightness")) ?? brightness,
      parseNumber(searchParams.get("hue")) ?? hue,
    ];

    const ctx = CANVAS.getContext("2d");
    ctx.resetTransform();
    ctx.clearRect(0, 0, 23, 16);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 6, 23 * (brightness ?? 0) / 64, 4);

    return makeResponse({
      "/settings2": encodeState({ brightness, hue }),
      "/timeout/brightness": encodeState({ date: new Date() }, {
        logo: encode(new Uint8Array([0xff, 0xff, 0xff])),
        bytes: encodeCanvas(CANVAS),
      }, { poll: 3000 }),
    });
  },
};
