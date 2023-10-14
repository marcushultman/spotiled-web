import { MiddlewareHandlerContext } from "$fresh/server.ts";

const baseUrl = Deno.env.get("BASE_URL") ?? "http://localhost:8080";

export async function handler(_: Request, ctx: MiddlewareHandlerContext) {
  const res = await ctx.next();
  res.headers.set(
    "Content-Security-Policy",
    `default-src 'self' 'unsafe-inline' ${baseUrl} `,
  );
  return res;
}
