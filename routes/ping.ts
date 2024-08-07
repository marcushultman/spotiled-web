import { Handlers } from "$fresh/server.ts";
import { makeResponse } from "../src/state.ts";

export const handler: Handlers = {
  GET: () => new Response(),
  POST: () => makeResponse({ "/ping": null }),
};
