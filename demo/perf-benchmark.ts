/**
 * Headless performance benchmark for squatch-js v2 vs next.
 *
 * Uses Playwright to load perf-frame.html for each SDK version,
 * collects instrumentation metrics, and prints a comparison table.
 *
 * Usage:
 *   npx tsx demo/perf-benchmark.ts              # 5 iterations (default)
 *   npx tsx demo/perf-benchmark.ts --runs 10    # 10 iterations
 *   npx tsx demo/perf-benchmark.ts --json       # Also output JSON
 *   npx tsx demo/perf-benchmark.ts --throttle   # Simulate slow 3G
 */

import { chromium, type Page, type CDPSession } from "playwright";
import { createServer, type Server, type IncomingMessage, type ServerResponse } from "http";
import { readFileSync, existsSync } from "fs";
import { join, extname, dirname } from "path";

// @ts-ignore -- tsx/node ESM handles import.meta fine at runtime
const __scriptDir = typeof __dirname !== "undefined" ? __dirname : dirname(new URL(import.meta.url).pathname);

// ── Configuration ──────────────────────────────────────────

const V2_URL = "https://fast.ssqt.io/squatch-js@2";
const NEXT_URL = "https://fast.ssqt.io/squatch-js@next";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
};

interface PerfMetrics {
  sdkUrl: string;
  sdkScriptLoad: number;
  sdkReady: number;
  frameCreated: number;
  meaningfulPaint: number;
  stable: number;
  timeUnstyled: number;
  bundleSizeBytes: number;
  totalLoad: number;
}

interface MetricDef {
  key: keyof PerfMetrics;
  label: string;
  unit: string;
  format: (v: number) => string;
  lowerBetter: boolean;
}

const METRICS: MetricDef[] = [
  { key: "bundleSizeBytes", label: "Bundle Size", unit: "KB", format: (v) => v > 0 ? (v / 1024).toFixed(1) : "—", lowerBetter: true },
  { key: "sdkScriptLoad", label: "SDK Script Load", unit: "ms", format: (v) => v > 0 ? v.toFixed(0) : "—", lowerBetter: true },
  { key: "sdkReady", label: "SDK Ready", unit: "ms", format: (v) => v > 0 ? v.toFixed(0) : "—", lowerBetter: true },
  { key: "frameCreated", label: "Frame Created", unit: "ms", format: (v) => v > 0 ? v.toFixed(0) : "—", lowerBetter: true },
  { key: "meaningfulPaint", label: "Meaningful Paint", unit: "ms", format: (v) => v > 0 ? v.toFixed(0) : "—", lowerBetter: true },
  { key: "timeUnstyled", label: "Time Unstyled", unit: "ms", format: (v) => v > 0 ? v.toFixed(0) : "—", lowerBetter: true },
  { key: "stable", label: "Time to Stable", unit: "ms", format: (v) => v > 0 ? v.toFixed(0) : "—", lowerBetter: true },
  { key: "totalLoad", label: "Total Load", unit: "ms", format: (v) => v > 0 ? v.toFixed(0) : "—", lowerBetter: true },
];

// ── CLI args ───────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  let runs = 5;
  let json = false;
  let throttle = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--runs" && args[i + 1]) {
      runs = parseInt(args[i + 1], 10);
      if (isNaN(runs) || runs < 1) runs = 5;
      i++;
    } else if (args[i] === "--json") {
      json = true;
    } else if (args[i] === "--throttle") {
      throttle = true;
    }
  }

  return { runs, json, throttle };
}

// ── Local static server for demo/ ──────────────────────────

function startServer(demoDir: string): Promise<{ server: Server; port: number }> {
  return new Promise((resolve, reject) => {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      const url = new URL(req.url || "/", "http://localhost");
      let filePath = join(demoDir, url.pathname === "/" ? "perf-frame.html" : url.pathname);

      if (!existsSync(filePath)) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      const ext = extname(filePath);
      const mime = MIME_TYPES[ext] || "application/octet-stream";
      const content = readFileSync(filePath);
      res.writeHead(200, { "Content-Type": mime });
      res.end(content);
    });

    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      if (typeof addr === "object" && addr) {
        resolve({ server, port: addr.port });
      } else {
        reject(new Error("Failed to start server"));
      }
    });
  });
}

// ── Collect metrics from a single page load ────────────────

async function collectMetrics(
  page: Page,
  baseUrl: string,
  sdkUrl: string,
  cdpSession?: CDPSession,
): Promise<PerfMetrics | null> {
  const cb = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const url = `${baseUrl}/perf-frame.html?sdk=${encodeURIComponent(sdkUrl)}&cb=${cb}`;

  // Enable network throttling if CDP session provided (simulates slow 3G)
  if (cdpSession) {
    await cdpSession.send("Network.emulateNetworkConditions", {
      offline: false,
      downloadThroughput: (500 * 1024) / 8, // 500 Kbps
      uploadThroughput: (500 * 1024) / 8,
      latency: 400, // 400ms RTT
    });
  }

  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Wait for metrics to be reported (poll for window.__perfMetrics)
  const metrics = await page.evaluate(() => {
    return new Promise<PerfMetrics | null>((resolve) => {
      let attempts = 0;
      const maxAttempts = 200; // 20 seconds
      const poll = setInterval(() => {
        attempts++;
        const m = (window as any).__perfMetrics;
        if (m && m.stable > 0) {
          clearInterval(poll);
          resolve({
            sdkUrl: m.sdkUrl,
            sdkScriptLoad: m.sdkScriptLoad,
            sdkReady: m.sdkReady,
            frameCreated: m.frameCreated,
            meaningfulPaint: m.meaningfulPaint,
            stable: m.stable,
            timeUnstyled: m.timeUnstyled || 0,
            bundleSizeBytes: m.bundleSizeBytes || 0,
            totalLoad: m.stable,
          });
        } else if (attempts >= maxAttempts) {
          clearInterval(poll);
          // Return partial data or null
          if (m) {
            resolve({
              sdkUrl: m.sdkUrl || "",
              sdkScriptLoad: m.sdkScriptLoad || 0,
              sdkReady: m.sdkReady || 0,
              frameCreated: m.frameCreated || 0,
              meaningfulPaint: m.meaningfulPaint || 0,
              stable: m.stable || 0,
              timeUnstyled: m.timeUnstyled || 0,
              bundleSizeBytes: m.bundleSizeBytes || 0,
              totalLoad: m.stable || 0,
            });
          } else {
            resolve(null);
          }
        }
      }, 100);
    });
  });

  return metrics;
}

// ── Averaging helper ───────────────────────────────────────

function averageMetrics(arr: (PerfMetrics | null)[]): PerfMetrics {
  const valid = arr.filter((m): m is PerfMetrics => m !== null);
  const avg: any = { sdkUrl: valid[0]?.sdkUrl || "" };

  for (const def of METRICS) {
    const values = valid.map((m) => m[def.key] as number).filter((v) => v > 0);
    avg[def.key] = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  return avg as PerfMetrics;
}

// ── Pretty console table ───────────────────────────────────

function printComparisonTable(v2: PerfMetrics, next: PerfMetrics) {
  const COL = { metric: 20, v2: 14, next: 14, delta: 14, pct: 10 };
  const sep = "─";

  function pad(s: string, w: number, right = false) {
    return right ? s.padStart(w) : s.padEnd(w);
  }

  const header =
    pad("Metric", COL.metric) +
    pad("v2", COL.v2, true) +
    pad("next", COL.next, true) +
    pad("Delta", COL.delta, true) +
    pad("Change", COL.pct, true);

  const divider = sep.repeat(header.length);

  console.log("\n" + divider);
  console.log(header);
  console.log(divider);

  for (const def of METRICS) {
    const v2Val = (v2[def.key] as number) || 0;
    const nextVal = (next[def.key] as number) || 0;
    const delta = nextVal - v2Val;
    const pct = v2Val > 0 ? (delta / v2Val) * 100 : 0;

    const isBetter = def.lowerBetter ? delta < 0 : delta > 0;
    const deltaStr =
      Math.abs(delta) < 1
        ? "≈"
        : (delta >= 0 ? "+" : "") + def.format(Math.abs(delta)) + " " + def.unit;
    const pctStr =
      Math.abs(pct) < 0.5 ? "—" : (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
    const marker = Math.abs(delta) < 1 ? " " : isBetter ? "✓" : "✗";

    console.log(
      pad(def.label, COL.metric) +
        pad(def.format(v2Val) + " " + def.unit, COL.v2, true) +
        pad(def.format(nextVal) + " " + def.unit, COL.next, true) +
        pad(deltaStr, COL.delta, true) +
        pad(marker + " " + pctStr, COL.pct, true),
    );
  }

  console.log(divider + "\n");
}

function printRunTable(runs: { v2: PerfMetrics | null; next: PerfMetrics | null }[]) {
  console.log("\n── Per-Run Details ──\n");
  const headers = ["Run", ...METRICS.flatMap((d) => [`v2 ${d.label}`, `next ${d.label}`])];
  console.log(headers.map((h) => h.padStart(16)).join(""));
  console.log("─".repeat(headers.length * 16));

  for (let i = 0; i < runs.length; i++) {
    const row = [`#${i + 1}`];
    for (const def of METRICS) {
      const v2Val = runs[i].v2 ? (runs[i].v2![def.key] as number) : 0;
      const nextVal = runs[i].next ? (runs[i].next![def.key] as number) : 0;
      row.push(def.format(v2Val) + " " + def.unit);
      row.push(def.format(nextVal) + " " + def.unit);
    }
    console.log(row.map((c) => c.padStart(16)).join(""));
  }
}

// ── Main ───────────────────────────────────────────────────

async function main() {
  const { runs: numRuns, json, throttle } = parseArgs();

  console.log(`\n🔍 squatch-js Performance Benchmark`);
  console.log(`   v2:   ${V2_URL}`);
  console.log(`   next: ${NEXT_URL}`);
  console.log(`   Runs: ${numRuns}${throttle ? " (throttled)" : ""}`);
  console.log(`\n   ⚠  Note: Headless mode serves pages from localhost. The widget API`);
  console.log(`      may reject CORS requests, preventing full widget rendering.`);
  console.log(`      For full comparison, use the web UI: npm run perf:ui → open`);
  console.log(`      http://localhost:4000/perf-compare.html in your browser.\n`);

  // Start local server to serve perf-frame.html
  const demoDir = __scriptDir;
  const { server, port } = await startServer(demoDir);
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`   Server: ${baseUrl}\n`);

  const browser = await chromium.launch({ headless: true });

  const allRuns: { v2: PerfMetrics | null; next: PerfMetrics | null }[] = [];

  try {
    for (let i = 0; i < numRuns; i++) {
      process.stdout.write(`   Run ${i + 1}/${numRuns}... `);

      // Fresh context for each run to avoid caching
      const context = await browser.newContext();
      const pageV2 = await context.newPage();
      const pageNext = await context.newPage();

      let cdpV2: CDPSession | undefined;
      let cdpNext: CDPSession | undefined;

      if (throttle) {
        cdpV2 = await context.newCDPSession(pageV2);
        cdpNext = await context.newCDPSession(pageNext);
      }

      // Run both versions in parallel
      const [v2, next] = await Promise.all([
        collectMetrics(pageV2, baseUrl, V2_URL, cdpV2),
        collectMetrics(pageNext, baseUrl, NEXT_URL, cdpNext),
      ]);

      allRuns.push({ v2, next });

      const v2Stable = v2 ? v2.stable.toFixed(0) + "ms" : "failed";
      const nextStable = next ? next.stable.toFixed(0) + "ms" : "failed";
      console.log(`v2=${v2Stable}  next=${nextStable}`);

      await context.close();
    }

    // ── Results ────────────────────────────────────────
    const v2Avg = averageMetrics(allRuns.map((r) => r.v2));
    const nextAvg = averageMetrics(allRuns.map((r) => r.next));

    console.log("\n══════════════════════════════════════════════════════════");
    console.log("   AVERAGED RESULTS (" + numRuns + " runs)");
    console.log("══════════════════════════════════════════════════════════");

    printComparisonTable(v2Avg, nextAvg);

    if (numRuns > 1) {
      printRunTable(allRuns);
    }

    if (json) {
      const output = {
        config: { v2Url: V2_URL, nextUrl: NEXT_URL, runs: numRuns, throttle },
        averages: { v2: v2Avg, next: nextAvg },
        runs: allRuns,
      };
      console.log("\n── JSON Output ──\n");
      console.log(JSON.stringify(output, null, 2));
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error("Benchmark failed:", err);
  process.exit(1);
});
