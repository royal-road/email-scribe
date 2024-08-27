import { Request, Response } from 'express';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function handlePresetSave(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const data = req.body;

    if (!data.presetName) {
      res.status(400).json({ message: 'Preset name is required' });
      return;
    }
    const presetsDir = join(process.cwd(), 'public', 'presets');

    const fileName = `${data.presetName}.json`;
    const filePath = join(presetsDir, fileName);

    // Check if the file already exists
    let existingData = {};
    try {
      const fileContent = await readFile(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch {
      // Now check if the folder exists
      try {
        await readdir(presetsDir);
      } catch {
        console.log('Presets folder does not exist, creating a new one');
        try {
          await mkdir(presetsDir, { recursive: true });
        } catch {
          console.log('Error creating presets folder');
          res.status(500).json({ message: 'Error saving preset' });
          return;
        }
        console.log('File does not exist, creating a new one');
      }
    }

    const updatedData = { ...existingData, ...data };
    await writeFile(filePath, JSON.stringify(updatedData, null, 2));

    res.status(200).json({ message: 'Preset saved successfully' });
  } catch (error) {
    console.error('Error saving preset:', error);
    res.status(500).json({ message: 'Error saving preset' });
  }
}

export async function handlePresetList(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const presetsDir = join(process.cwd(), 'public', 'presets');
    const files = await readdir(presetsDir, { withFileTypes: true });
    const presets = files
      .filter((file) => file.isFile() && file.name.endsWith('.json'))
      .map((file) => file.name.replace('.json', ''));

    res.status(200).json(presets);
  } catch (error) {
    console.error('Error listing presets:', error);
    res.status(500).json({ message: 'No Presets.' });
  }
}

export async function handlePresetLoad(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const presetName = req.query.presetName as string;

    if (!presetName) {
      res.status(400).json({ message: 'Preset name is required' });
      return;
    }

    const presetsDir = join(process.cwd(), 'public', 'presets');
    const fileName = `${presetName}.json`;
    const filePath = join(presetsDir, fileName);

    const fileContent = await readFile(filePath, 'utf-8');
    res.status(200).json(JSON.parse(fileContent));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      res.status(404).json({ message: 'Preset not found' });
    } else {
      console.error('Error loading preset:', error);
      res.status(500).json({ message: 'Error loading preset' });
    }
  }
}
