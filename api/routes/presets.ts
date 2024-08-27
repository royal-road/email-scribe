import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function handlePresetSave(req: Request): Promise<Response> {
  try {
    const data = await req.json();

    if (!data.presetName) {
      return new Response('Preset name is required', { status: 400 });
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
          return new Response('Error saving preset', { status: 500 });
        }
        console.log('File does not exist, creating a new one');
      }
    }

    const updatedData = { ...existingData, ...data };
    await writeFile(filePath, JSON.stringify(updatedData, null, 2));

    return new Response('Preset saved successfully', { status: 200 });
  } catch (error) {
    console.error('Error saving preset:', error);
    return new Response('Error saving preset', { status: 500 });
  }
}

export async function handlePresetList(): Promise<Response> {
  try {
    const presetsDir = join(process.cwd(), 'public', 'presets');
    const files = await readdir(presetsDir, { withFileTypes: true });
    const presets = files
      .filter((file) => file.isFile() && file.name.endsWith('.json'))
      .map((file) => file.name.replace('.json', ''));

    return new Response(JSON.stringify(presets), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error listing presets:', error);
    return new Response('No Presets.', { status: 500 });
  }
}

export async function handlePresetLoad(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const presetName = url.searchParams.get('presetName');

    if (!presetName) {
      return new Response('Preset name is required', { status: 400 });
    }

    const presetsDir = join(process.cwd(), 'public', 'presets');
    const fileName = `${presetName}.json`;
    const filePath = join(presetsDir, fileName);

    const fileContent = await readFile(filePath, 'utf-8');
    return new Response(fileContent, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return new Response('Preset not found', { status: 404 });
    }
    console.error('Error loading preset:', error);
    return new Response('Error loading preset', { status: 500 });
  }
}
