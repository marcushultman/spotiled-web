import { Handlers } from "$fresh/server.ts";
import { encode } from "https://deno.land/std@0.106.0/encoding/base64.ts";
import { makeDisplay } from "../../src/rendering.ts";
import { decodeServiceRequest, encodeState, Prio } from "../../src/state.ts";
import { timeOfDayBrightness } from "../../src/time_of_day_brightness.ts";

interface Data {
  enabled: boolean;
}

export const handler: Handlers = {
  async POST(req, _) {
    const { data: { enabled } } = await decodeServiceRequest<Data>(req, { enabled: false });

    const kv = await Deno.openKv();
    const { value } = await kv.get<{ brightness: number; hue: number }>(["settings"]);
    const { brightness = 1, hue = 255 } = value ?? {};

    const logo = encode(new Uint8Array(timeOfDayBrightness({ brightness, hue })));
    const bytes = makeDisplay((ctx) => {
      ctx.fillStyle = `rgb(${brightness},${brightness},${brightness}})`;
      ctx.fillRect(0, 0, 23, 16);

      ctx.fillStyle = `rgb(${brightness},0,0})`;
      for (let y = 0; y < 16; y += 2) {
        ctx.fillRect(0, y, 23, 1);
      }

      ctx.fillStyle = `rgb(0,0,${brightness}})`;
      ctx.fillRect(0, 0, 10, 9);

      ctx.fillStyle = `rgb(${brightness},${brightness},${brightness}})`;
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
      "/led/flag": encodeState({ enabled: true }, { logo, bytes, prio: Prio.NOTIFICATION }, {
        poll: 3000,
      }),
    });
  },
};
