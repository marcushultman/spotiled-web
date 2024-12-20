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
  data?: string;
  display?: Display;
  poll?: number;
  timeout?: number;
}

export async function parseData<T>(body: Body, def: T): Promise<T> {
  try {
    return JSON.parse(atob(await body.text()));
  } catch (_) {
    return def;
  }
}

export type Params<T> = { data?: T } & Partial<Omit<State, "data">>;

export function makeState<T>({ data, ...params }: Params<T> = {}): State {
  return { ...data ? { data: btoa(JSON.stringify(data)) } : {}, ...params };
}

export function makeResponse(states: { [id: string]: State | null }) {
  return Response.json(states);
}

export function redirect(id: string, base: string | URL) {
  return Response.redirect(new URL(id, base), 307);
}
