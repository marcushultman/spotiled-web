import { Handlers } from "$fresh/server.ts";
import { encode } from "$std/encoding/base64.ts";
import { encodeCanvas } from "../../src/rendering.ts";
import { createCanvas } from "../../src/rendering.ts";
import { decodeServiceRequest } from "../../src/state.ts";
import { Prio } from "../../src/state.ts";
import { encodeState, makeResponse } from "../../src/state.ts";

interface Data {
  text: string;
}

let canvas = createCanvas(23, 16);

const CHAR_WIDTH = (() => {
  const ctx = canvas.getContext("2d");
  ctx.scale(2 / 3, 1);
  ctx.font = "14px monospace";
  return ctx.measureText(" ").width;
})();

export const handler: Handlers = {
  POST: async (req) => {
    const url = new URL(req.url);
    const text = url.searchParams.get("text")?.toUpperCase() ??
      (await decodeServiceRequest<Data>(req, { text: "" })).data.text;

    const width = CHAR_WIDTH * (text.length + 1);
    const poll = width * 1000 / 5;

    if (width > canvas.width) {
      canvas = createCanvas(width, 16);
    }

    const ctx = canvas.getContext("2d");
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(2 / 3, 1);

    ctx.fillStyle = "white";
    ctx.font = "14px monospace";
    ctx.fillText(text, 0, 13);

    return makeResponse({
      "/led/text": encodeState(
        { text },
        {
          logo: encode(new Uint8Array([0xFF, 0xFF, 0xFF])),
          bytes: encodeCanvas(canvas, width),
          width,
          xscroll: 5,
          prio: Prio.NOTIFICATION,
        },
      ),
      "/timeout/led/text": encodeState({ date: new Date() }, undefined, { poll }),
    });
  },
};
