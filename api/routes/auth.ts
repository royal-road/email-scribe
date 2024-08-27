import { Request, Response } from 'express';

export function handleAuth(req: Request, res: Response): void {
  res.status(200).json({ message: 'authenticated' });
}
