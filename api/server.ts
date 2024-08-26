import { corsHeaders } from './utils/cors';
import { handleUpload } from './routes/upload';
import { handleAuth } from './routes/auth';
import { handleTemplate } from './routes/template';

type Path = "/upload" | "/auth" | "/template";
type Method = "GET" | "POST";
type ApiEndpoint = `${Method} ${Path}`;

Bun.serve({
  port: 8080,
  async fetch(req) {
    try {
      const url = new URL(req.url);
      const method = req.method;

      if (method === "OPTIONS") {
        return new Response(null, {
          headers: corsHeaders,
          status: 204,
        });
      }

      const apiEndpoint: ApiEndpoint = `${method as Method} ${url.pathname as Path}`;

      let response: Response;

      switch (apiEndpoint) {
        case "POST /upload":
          response = await handleUpload(req);
          break;
        case "GET /auth":
          response = handleAuth();
          break;
        case "GET /template":
          response = await handleTemplate();
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
