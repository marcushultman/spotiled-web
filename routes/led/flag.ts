import { Handlers } from "$fresh/server.ts";
import { encode } from "https://deno.land/std@0.106.0/encoding/base64.ts";
import { makeDisplay } from "../../src/rendering.ts";
import { decodeServiceRequest, encodeState } from "../../src/state.ts";

interface Data {
  enabled: boolean;
}

const LOGO = encode(new Uint8Array([0xFF, 0xFF, 0xFF]));

export const handler: Handlers = {
  async POST(req, _) {
    const { data: { enabled } } = await decodeServiceRequest<Data>(req, { enabled: false });

    const bytes = makeDisplay((ctx) => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 23, 16);

      ctx.fillStyle = "red";
      for (let y = 0; y < 16; y += 2) {
        ctx.fillRect(0, y, 23, 1);
      }

      ctx.fillStyle = "blue";
      ctx.fillRect(0, 0, 10, 9);

      ctx.fillStyle = "white";
      for (let x = 1; x < 9; x += 2) {
        for (let y = 1; y < 8; y += 4) {
          ctx.fillRect(x, y, 1, 1);
        }
      }
    });

    if (enabled) {
      return Response.json({ "/led/flag": null });
    }

    return Response.json({
      "/led/flag": encodeState({ enabled: true }, { logo: LOGO, bytes }, { poll: 3000 }),
    });
  },
};
