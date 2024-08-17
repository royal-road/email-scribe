type Path = "/upload" | "/auth";
type Method = "GET" | "POST";
type ApiEndpoint = `${Method} ${Path}`;

// A simple server to mock uploading images and possibly separate authentication (not sure of auth just yet)
Bun.serve({
  port: 8080,
  fetch(req) {
    try {
      const url = new URL(req.url);
      const method = req.method;

      const apiEndpoint: ApiEndpoint = `${method as Method} ${
        url.pathname as Path
      }`;

      switch (apiEndpoint) {
        case "POST /upload":
          return new Response(JSON.stringify({ message: `File saved` }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
          });
        case "GET /auth":
          return new Response(JSON.stringify({ message: `authenticated` }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
          });
        default:
          return new Response(
            JSON.stringify({
              message: `Unhandled Endpoint: ${apiEndpoint}.`,
            }),
            { headers: { "Content-Type": "application/json" }, status: 404 }
          );
      }
    } catch (err) {
      console.log(err);
      return new Response(
        JSON.stringify({ message: "Internal Server Error" }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }
  },
});
