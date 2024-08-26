import { resizeImage } from '../utils/imageProcessing'

export async function handleUpload(req: Request): Promise<Response> {
  if (req.headers.get("Content-Type")?.includes("multipart/form-data")) {
    console.log("Uploading file");
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const width = formData.get("width");

    if (file) {
      const filename = `${Date.now()}-${file.name}`;
      const filePath = `public/uploads/${filename}`;

      const buffer = await file.arrayBuffer();
      const resizedBuffer = await resizeImage(buffer, parseInt(width as string));
      await Bun.write(filePath, resizedBuffer);

      const fileUrl = `/uploads/${filename}`;

      return new Response(JSON.stringify({ url: fileUrl }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }
  } else {
    return new Response(JSON.stringify({ error: "Invalid Content-Type" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
}
