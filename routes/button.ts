import { Handlers } from "$fresh/server.ts";
import { makeResponse } from "../src/state.ts";

export const handler: Handlers = {
  async POST(req) {
    return makeResponse({});
  },
};
