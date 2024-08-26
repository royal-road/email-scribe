import sharp from "sharp";

export async function resizeImage(
  buffer: ArrayBuffer,
  width?: number
): Promise<Buffer> {
  console.log("Resizing image to width: ", width);
  if (!width || isNaN(width)) return sharp(buffer).toFormat("webp").toBuffer();
  return sharp(buffer).resize({ width: width }).toFormat("webp").toBuffer();
}
