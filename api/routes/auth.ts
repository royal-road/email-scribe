export function handleAuth(): Response {
  return new Response(JSON.stringify({ message: `authenticated` }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
