import { Request, Response } from 'express';
import { resizeImage } from '../utils/imageProcessing';
import multer from 'multer';
import path from 'path';

const upload = multer({ dest: 'public/uploads/' });

export const handleUpload = [
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const width = req.body.width ? parseInt(req.body.width) : undefined;

      // Convert Buffer to ArrayBuffer and assert the type
      const arrayBuffer = req.file.buffer.buffer.slice(
        req.file.buffer.byteOffset,
        req.file.buffer.byteOffset + req.file.buffer.byteLength
      ) as ArrayBuffer;

      const resizedBuffer = await resizeImage(arrayBuffer, width);

      const filename = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

      await Bun.write(filePath, resizedBuffer);

      const fileUrl = `/uploads/${filename}`;

      res.status(200).json({ url: fileUrl });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Error uploading file' });
    }
  },
];
