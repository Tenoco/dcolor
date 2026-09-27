export const config = { runtime: "edge" };

const UPSTREAM = "https://echonet2.onrender.com/dcolor";

export default async function handler(req) {
  const url = new URL(req.url);
  const targetUrl = UPSTREAM + url.pathname + url.search;

  const upstreamReq = new Request(targetUrl, {
    method: req.method,
    headers: req.headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
    redirect: "manual",
  });

  const upstreamRes = await fetch(upstreamReq);

  const headers = new Headers(upstreamRes.headers);
  const loc = headers.get("location");
  if (loc) {
    let fixed = loc;
    if (fixed.startsWith("https://echonet2.onrender.com/dcolor")) {
      fixed = fixed.slice("https://echonet2.onrender.com/dcolor".length) || "/";
    } else if (fixed.startsWith("/dcolor")) {
      fixed = fixed.slice("/dcolor".length) || "/";
    }
    headers.set("location", fixed);
  }
  headers.delete("content-encoding");
  headers.delete("content-length");

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    statusText: upstreamRes.statusText,
    headers,
  });
}
