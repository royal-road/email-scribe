import sharp from 'sharp';
const maxHeight = 1000;

export async function resizeImage(
  buffer: ArrayBuffer,
  width?: number
): Promise<Buffer> {
  console.log('Resizing image to width: ', width);
  if (!width || isNaN(width))
    return sharp(buffer)
      .resize({ height: maxHeight })
      .toFormat('webp')
      .toBuffer();
  return sharp(buffer).resize({ width: width }).toFormat('webp').toBuffer();
}
