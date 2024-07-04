import { RouteContext } from "$fresh/server.ts";

export default async function (_req: Request, { url }: RouteContext) {
  const res = await fetch(new URL("/api/sports", url));

  if (!res.ok) {
    return res;
  }
  const arr = await res.bytes();
  const dataURL = res.headers.get("x-spotiled-image-url")!;

  const toHex = (byte: number) => byte.toString(16).padStart(2, "0");

  return (
    <div class={"bg-black"}>
      <img src={dataURL} />
      <div
        class={"grid grid-flow-col auto-cols-min"}
        style={`grid-template-rows: repeat(16, minmax(0, 1fr))`}
      >
        {Array(23 * 16).fill(0).map((_, i) => arr.subarray(i * 3, i * 3 + 3)).map(([r, g, b]) => (
          <div class={`mx-1 w-3 h-2 bg-[#${[r, g, b].map(toHex).join("")}]`} />
        ))}
      </div>
    </div>
  );
}
