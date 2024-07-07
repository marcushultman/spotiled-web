import { RouteContext } from "$fresh/server.ts";

const toHex = (byte: number) => byte.toString(16).padStart(2, "0");
const toHexColor = ([r, g, b, a]: Uint8Array) => `#${[r, g, b, a].map(toHex).join("")}`;

export default async function (_req: Request, { url }: RouteContext) {
  const res = await fetch(new URL("/api/sports", url));

  if (!res.ok) {
    return res;
  }
  const bytes = await res.bytes();
  return (
    <div class={"bg-black"}>
      <div
        class={"grid grid-flow-col auto-cols-min"}
        style={`grid-template-rows: repeat(16, minmax(0, 1fr))`}
      >
        {Array(23 * 16).fill(0).map((_, i) => bytes.subarray(i * 4, (i + 1) * 4)).map(
          (color) => <div class={`mx-1 w-3 h-2 bg-[${toHexColor(color)}]`} />,
        )}
      </div>
    </div>
  );
}
