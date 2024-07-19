import { ImageData } from "https://deno.land/x/canvas@v1.4.1/mod.ts";

export function transpose(img: ImageData) {
  const { width, height } = img;
  const numPixels = width * height;

  const rowMajorRGBA = img.data;
  const colMajorRGBA = new Uint8Array(rowMajorRGBA.length);

  for (let i = 0; i < numPixels; ++i) {
    const dst = (i % width) * height + Math.floor(i / width);
    for (let ch = 0; ch < 4; ++ch) {
      colMajorRGBA[4 * dst + ch] = rowMajorRGBA[4 * i + ch];
    }
  }
  return colMajorRGBA;
}
