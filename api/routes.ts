import sharp from "sharp";

type Path = "/upload" | "/auth" | "/template";
type Method = "GET" | "POST";
type ApiEndpoint = `${Method} ${Path}`;
const templatePath = "testBench/AIO.html";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// A simple server to mock uploading images and possibly separate authentication (not sure of auth just yet)
Bun.serve({
  port: 8080,
  async fetch(req) {
    try {
      const url = new URL(req.url);
      const method = req.method;

      // Handle preflight requests
      if (method === "OPTIONS") {
        return new Response(null, {
          headers: corsHeaders,
          status: 204,
        });
      }

      const apiEndpoint: ApiEndpoint = `${method as Method} ${
        url.pathname as Path
      }`;

      let response: Response;

      switch (apiEndpoint) {
        case "POST /upload":
          console.log("Trying to upload");
          if (
            req.headers.get("Content-Type")?.includes("multipart/form-data")
          ) {
            console.log("Uploading file");
            const formData = await req.formData();
            const file = formData.get("file") as File;
            const width = formData.get("width");

            if (file) {
              // Generate a unique filename
              const filename = `${Date.now()}-${file.name}`;
              const filePath = `public/uploads/${filename}`;

              // Read the file
              const buffer = await file.arrayBuffer();

              // Resize the image (if no width is provided, it will just convert to webp for smaller size)
              const resizedBuffer = await resizeImage(
                buffer,
                parseInt(width as string)
              );
              await Bun.write(filePath, resizedBuffer);

              // Generate a URL for the saved file
              const fileUrl = `/uploads/${filename}`;

              response = new Response(JSON.stringify({ url: fileUrl }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
              });
            } else {
              response = new Response(
                JSON.stringify({ error: "No file uploaded" }),
                {
                  headers: { "Content-Type": "application/json" },
                  status: 400,
                }
              );
            }
          } else {
            response = new Response(
              JSON.stringify({ error: "Invalid Content-Type" }),
              {
                headers: { "Content-Type": "application/json" },
                status: 400,
              }
            );
          }
          break;
        case "GET /auth":
          response = new Response(
            JSON.stringify({ message: `authenticated` }),
            {
              headers: { "Content-Type": "application/json" },
              status: 200,
            }
          );
          break;
        case "GET /template":
          response = new Response(await Bun.file(templatePath).text(), {
            headers: { "Content-Type": "text/html" },
            status: 200,
          });
          break;
        default:
          response = new Response(
            JSON.stringify({
              message: `Unhandled Endpoint: ${apiEndpoint}.`,
            }),
            { headers: { "Content-Type": "application/json" }, status: 404 }
          );
      }

      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (err) {
      console.log(err);
      return new Response(
        JSON.stringify({ message: "Internal Server Error" }),
        {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
          status: 500,
        }
      );
    }
  },
});
async function resizeImage(
  buffer: ArrayBuffer,
  width?: number
): Promise<Buffer> {
  console.log("Resizing image to width: ", width);
  if (!width || isNaN(width)) return sharp(buffer).toFormat("webp").toBuffer();
  return sharp(buffer).resize({ width: width }).toFormat("webp").toBuffer();
}
