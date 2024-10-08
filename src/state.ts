// Request

export interface ServiceRequest<T> {
  data: T;
}

// Response

export interface Behavior {
  poll?: number;
  timeout?: number;
}

export enum Prio {
  APP = 0,
  NOTIFICATION = 1,
}

export interface Display {
  logo: string; // [number, number, number];
  bytes: string;
  prio?: Prio;

  width?: number;
  height?: number;
  xscroll?: number;
  wave?: number;
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
    const data = await req.text();
    return { data: JSON.parse(atob(data)) };
  } catch (_) {
    return { data: def };
  }
}

export function encodeState<T>(data?: T, display?: Display, behavior?: Behavior): State {
  return { data: data ? btoa(JSON.stringify(data)) : "", display, ...behavior };
}

export function makeResponse(res: ServiceResponse) {
  return Response.json(res);
}

export function redirect(id: string, base: string | URL) {
  return Response.redirect(new URL(id, base), 307);
}
