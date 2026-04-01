/**
 * Dev server for perf comparison UI.
 * Serves static files from demo/ and proxies /api/* to staging (bypasses CORS).
 *
 * Usage:
 *   npx tsx demo/perf-server.ts
 *   npx tsx demo/perf-server.ts --port 5000
 */
import { createServer, type IncomingMessage, type ServerResponse } from "http";
import { request as httpsRequest } from "https";
import { readFileSync, existsSync, statSync } from "fs";
import { join, extname, dirname } from "path";

const __scriptDir =
  typeof __dirname !== "undefined"
    ? __dirname
    : dirname(new URL(import.meta.url).pathname);

const STAGING_HOST = "staging.referralsaasquatch.com";

const MIME: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function parsePort(): number {
  const i = process.argv.indexOf("--port");
  if (i !== -1 && process.argv[i + 1]) {
    const p = parseInt(process.argv[i + 1], 10);
    if (!isNaN(p) && p > 0) return p;
  }
  return 4001;
}

function proxy(req: IncomingMessage, res: ServerResponse, path: string) {
  const chunks: Buffer[] = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const body = Buffer.concat(chunks);
    const headers: Record<string, string> = {};
    for (const [k, v] of Object.entries(req.headers)) {
      if (["host", "origin", "referer", "connection"].includes(k)) continue;
      if (typeof v === "string") headers[k] = v;
    }
    headers["host"] = STAGING_HOST;

    const proxyReq = httpsRequest(
      { hostname: STAGING_HOST, port: 443, path, method: req.method, headers },
      (proxyRes) => {
        const rh: Record<string, string | string[]> = {};
        for (const [k, v] of Object.entries(proxyRes.headers)) {
          if (v) rh[k] = v;
        }
        rh["access-control-allow-origin"] = "*";
        rh["access-control-allow-methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        rh["access-control-allow-headers"] =
          "Content-Type, Authorization, X-SaaSquatch-Referrer";
        res.writeHead(proxyRes.statusCode || 502, rh);
        proxyRes.pipe(res);
      },
    );
    proxyReq.on("error", (err) => {
      res.writeHead(502, { "Content-Type": "text/plain" });
      res.end("Proxy error: " + err.message);
    });
    if (body.length > 0) proxyReq.write(body);
    proxyReq.end();
  });
}

function serveStatic(res: ServerResponse, urlPath: string) {
  let fp = join(__scriptDir, urlPath);
  // Clean URLs: try .html extension
  if (!existsSync(fp) || statSync(fp).isDirectory()) {
    const withHtml = fp + ".html";
    if (existsSync(withHtml)) fp = withHtml;
  }
  if (!existsSync(fp) || statSync(fp).isDirectory()) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const ext = extname(fp);
  res.writeHead(200, {
    "Content-Type": MIME[ext] || "application/octet-stream",
  });
  res.end(readFileSync(fp));
}

const port = parsePort();

createServer((req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${port}`);
  const path = url.pathname + url.search;

  // CORS preflight
  if (
    req.method === "OPTIONS" &&
    (url.pathname.startsWith("/api/") || url.pathname.startsWith("/a/"))
  ) {
    res.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
      "access-control-allow-headers":
        "Content-Type, Authorization, X-SaaSquatch-Referrer",
      "access-control-max-age": "86400",
    });
    res.end();
    return;
  }

  // Proxy API and cookie requests
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/a/")) {
    proxy(req, res, path);
    return;
  }

  serveStatic(
    res,
    url.pathname === "/" ? "/perf-compare.html" : url.pathname,
  );
}).listen(port, () => {
  console.log(`\n  Perf server: http://localhost:${port}/perf-compare`);
  console.log(
    `  API proxy:   /api/* → https://${STAGING_HOST}/api/*\n`,
  );
});
