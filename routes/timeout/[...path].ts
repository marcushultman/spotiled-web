import { Handlers } from "$fresh/server.ts";
import { makeResponse } from "../../src/state.ts";
import { encodeState } from "../../src/state.ts";
import { decodeServiceRequest } from "../../src/state.ts";

interface Data {
  date: string;
}

/**
 * State machine whose only job is to remove another state after a timeout
 */
export const handler: Handlers = {
  async POST(req, { params: { path } }) {
    const { data } = await decodeServiceRequest<Data>(req, { date: new Date().toISOString() });

    const now = Date.now();
    const timeout = new URL(req.url).searchParams.get("in");
    const date = timeout ? new Date(now + parseInt(timeout)) : new Date(data.date);

    return makeResponse(
      now < date.getTime()
        ? { [`/timeout/${path}`]: encodeState({ date }, undefined, { poll: date.getTime() - now }) }
        : { [`/timeout/${path}`]: null, [`/${path}`]: null },
    );
  },
};
