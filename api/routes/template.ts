const templatePath = "testBench/AIO.html";

export async function handleTemplate(): Promise<Response> {
  return new Response(await Bun.file(templatePath).text(), {
    headers: { "Content-Type": "text/html" },
    status: 200,
  });
}
