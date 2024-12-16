import {
  CanvasRenderingContext2D,
  createCanvas,
  EmulatedCanvas2D,
} from "https://deno.land/x/canvas@v1.4.2/mod.ts";
import { transpose } from "./transpose.ts";
import { encode } from "$std/encoding/base64.ts";

export { createCanvas };

export function encodeCanvas(canvas: EmulatedCanvas2D, width = canvas.width) {
  return encode(transpose(canvas.getContext("2d").getImageData(0, 0, width, canvas.height)));
}

const CTX = createCanvas(23, 16).getContext("2d");

export function makeDisplay(draw: (ctx: CanvasRenderingContext2D) => void) {
  CTX.resetTransform();
  CTX.clearRect(0, 0, 23, 16);
  draw(CTX);
  return encode(transpose(CTX.getImageData(0, 0, 23, 16)));
}
