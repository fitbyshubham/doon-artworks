// ✅ Correct example
export async function GET(request: Request) {
  return new Response("Hello");
}

export async function POST(request: Request) {
  return new Response("Posted");
}
