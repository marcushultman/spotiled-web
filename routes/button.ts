import { Handlers } from "$fresh/server.ts";
import { encode } from "$std/encoding/base64.ts";
import { makeDisplay } from "../src/rendering.ts";
import { encodeState, makeResponse } from "../src/state.ts";

export const handler: Handlers = {
  POST() {
    return makeResponse({
      "/button": encodeState(undefined, {
        logo: encode(new Uint8Array([0xFF, 0xFF, 0xFF])),
        bytes: makeDisplay((ctx) => {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, 10, 10);
        }),
      }, { timeout: 3000 }),
    });
  },
};
