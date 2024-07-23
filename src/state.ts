// Request

import { assert } from "https://deno.land/std@0.216.0/assert/assert.ts";

export interface ServiceRequest<T> {
  data: T;
}

// Response

export interface Behavior {
  poll?: number;
}

export interface Display {
  logo: string; // [number, number, number];
  bytes: string;
}

export interface State {
  data: string;
  behavior?: Behavior;
  display?: Display;
}

export interface ServiceResponse {
  [id: string]: State | null;
}

// Helpers

export async function decodeServiceRequest<T>(req: Request, def: T): Promise<ServiceRequest<T>> {
  try {
    const contentType = req.headers.get("content-type");
    if (contentType === "application/json") {
      const { data } = await req.json();
      return { data: JSON.parse(atob(data)) };
    } else if (contentType === "application/x-www-form-urlencoded") {
      const formData = await req.formData();
      const data = formData.get("data");
      assert(typeof data === "string");
      return { data: JSON.parse(atob(data)) };
    }
    throw {};
  } catch (_) {
    return { data: def };
  }
}

export function encodeState<T>(data?: T, display?: Display, behavior?: Behavior): State {
  return { data: data ? btoa(JSON.stringify(data)) : "", display, behavior };
}

export function makeResponse(res: ServiceResponse) {
  return Response.json(res);
}
