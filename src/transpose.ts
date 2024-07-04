export function transpose(width: number, widthMajorRGBA: Uint8Array) {
  const pixels = widthMajorRGBA.length / 4;
  const colMajorRGBA = new Uint8Array(widthMajorRGBA.length);
  const height = widthMajorRGBA.length / (4 * width);

  for (let i = 0; i < pixels; ++i) {
    const dst = (i % width) * height + Math.floor(i / width);
    for (let ch = 0; ch < 4; ++ch) {
      colMajorRGBA[4 * dst + ch] = widthMajorRGBA[4 * i + ch];
    }
  }
  return colMajorRGBA;
}
