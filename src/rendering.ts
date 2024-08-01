import {
  CanvasRenderingContext2D,
  createCanvas,
  EmulatedCanvas2D,
} from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { transpose } from "./transpose.ts";
import { encode } from "$std/encoding/base64.ts";

function _createCanvas(width: number, height: number) {
  return createCanvas(width, height);
}

function _encodeCanvas(canvas: EmulatedCanvas2D) {
  return encode(transpose(canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height)));
}

export { _createCanvas as createCanvas, _encodeCanvas as encodeCanvas };

const CTX = createCanvas(23, 16).getContext("2d");

export function makeDisplay(draw: (ctx: CanvasRenderingContext2D) => void) {
  CTX.resetTransform();
  CTX.clearRect(0, 0, 23, 16);
  draw(CTX);
  return encode(transpose(CTX.getImageData(0, 0, 23, 16)));
}
