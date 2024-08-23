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
          response = new Response(JSON.stringify({ message: `File saved` }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
          });
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

      // Add CORS headers to the response
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
