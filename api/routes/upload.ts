import { Request, Response } from 'express';
import { resizeImage } from '../utils/imageProcessing';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const upload = multer({ dest: 'public/uploads/' });

export const handleUpload = [
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const width = req.body.width ? parseInt(req.body.width) : undefined;

      // Read the file from disk
      const filePath = req.file.path;
      const fileBuffer = await fs.readFile(filePath);

      // Convert Buffer to ArrayBuffer
      const arrayBuffer = fileBuffer.buffer.slice(
        fileBuffer.byteOffset,
        fileBuffer.byteOffset + fileBuffer.byteLength
      ) as ArrayBuffer;

      const resizedBuffer = await resizeImage(arrayBuffer, width);

      const filename = `${Date.now()}-${req.file.originalname}`;
      const outputPath = path.join(
        process.cwd(),
        'public',
        'uploads',
        filename
      );

      // Write the resized image
      await fs.writeFile(outputPath, Buffer.from(resizedBuffer));

      // Remove the original uploaded file
      await fs.unlink(filePath);

      const fileUrl = `/uploads/${filename}`;

      res.status(200).json({ url: fileUrl });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Error uploading file' });
    }
  },
];
