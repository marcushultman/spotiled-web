import { Handlers } from "$fresh/server.ts";
import { decodeServiceRequest } from "../src/state.ts";
import { encodeState } from "../src/state.ts";
import { makeResponse } from "../src/state.ts";

interface Data {
  brightness?: number;
  hue?: number;
}

const parseNumber = (n: string | null) => n ? Number(n) : undefined;

export const handler: Handlers = {
  async POST(req) {
    let { data: { brightness, hue } } = await decodeServiceRequest<Data>(req, {});
    const { searchParams } = new URL(req.url);
    [brightness, hue] = [
      parseNumber(searchParams.get("brightness")) ?? brightness,
      parseNumber(searchParams.get("hue")) ?? hue,
    ];
    return makeResponse({ "/settings2": encodeState({ brightness, hue }) });
  },
};
