import { join } from 'path';

const BASE_TEMPLATE_PATH = 'testBench';

export async function handleTemplate(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const templateId = url.searchParams.get('id');
  console.log(templateId);

  if (!templateId) {
    return new Response('Template ID is required', { status: 400 });
  }

  const templatePath = join(BASE_TEMPLATE_PATH, `${templateId}.html`);

  try {
    const fileContent = await Bun.file(templatePath).text();
    return new Response(fileContent, {
      headers: { 'Content-Type': 'text/html' },
      status: 200,
    });
  } catch (error) {
    console.error(`Error reading template file: ${error}`);
    return new Response('Template not found', { status: 404 });
  }
}
