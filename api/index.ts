// Vercel serverless entrypoint. Bridges Vercel's Node.js (req, res) function
// signature to the Web-standard fetch(request) handler that our TanStack
// Start build emits at dist/server/server.js. This file is bundled by
// Vercel's zero-config Node builder AFTER `npm run build` has already run,
// so the dist/ import below resolves against real build output on disk.
import type { IncomingMessage, ServerResponse } from "node:http";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // @ts-expect-error dist/ is a build artifact, not part of the TS project
  const { default: app } = await import("../dist/server/server.js");

  const protocol = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = req.headers.host;
  const url = `${protocol}://${host}${req.url}`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value == null) continue;
    headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }

  const method = req.method ?? "GET";
  const hasBody = method !== "GET" && method !== "HEAD";

  const request = new Request(url, {
    method,
    headers,
    // @ts-expect-error Node accepts a readable stream body with duplex: "half"
    body: hasBody ? req : undefined,
    duplex: hasBody ? "half" : undefined,
  });

  const response: Response = await app.fetch(request);

  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (response.body) {
    const reader = response.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  }
  res.end();
}
