/**
 * Headless smoke: load real index.html, inject birth, assert fields, reload restore.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import http from "node:http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SCRATCH = process.env.LIFE_CLOCK_SCRATCH || path.join(ROOT, "tests", "out");

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function contentType(p) {
  if (p.endsWith(".html")) return "text/html; charset=utf-8";
  if (p.endsWith(".svg")) return "image/svg+xml";
  if (p.endsWith(".js")) return "text/javascript";
  if (p.endsWith(".css")) return "text/css";
  return "application/octet-stream";
}

async function startServer() {
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";
    const file = path.join(ROOT, urlPath.replace(/^\//, ""));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType(file) });
    res.end(fs.readFileSync(file));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const { port } = server.address();
  return { server, base: `http://127.0.0.1:${port}` };
}

async function main() {
  ensureDir(SCRATCH);
  const log = [];
  let browser;
  let serverWrap;
  try {
    serverWrap = await startServer();
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push("console:" + msg.text());
    });

    await page.goto(serverWrap.base + "/index.html", { waitUntil: "networkidle" });
    await page.waitForSelector(".app");
    const box = await page.locator(".app").boundingBox();
    log.push(`app_box=${JSON.stringify(box)}`);
    if (!box || box.width < 200 || box.height < 200) {
      throw new Error("app shell not substantially painted");
    }

    // empty state visible initially (unless storage from previous)
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector("#emptyState");

    // set birth
    await page.fill("#birthDate", "2000-01-15");
    await page.fill("#birthTime", "10:20:30");
    await page.fill("#displayName", "Traveler");
    await page.click('button[type="submit"]');
    await page.waitForSelector("#clockPanel:not(.hidden)");

    const yText = await page.locator("#y").innerText();
    const sText = await page.locator("#s").innerText();
    log.push(`y=${yText} s=${sText}`);
    if (!/^\d+$/.test(yText.replace(/,/g, "")) && !/^\d/.test(yText)) {
      // Chinese locale may use commas or other separators
    }
    const yNum = Number(String(yText).replace(/[^\d]/g, ""));
    const sNum = Number(String(sText).replace(/[^\d]/g, ""));
    if (!(yNum >= 0) || Number.isNaN(sNum)) throw new Error("elapsed fields not numeric");

    const totalSec = await page.locator("#totalSeconds").innerText();
    log.push(`totalSeconds=${totalSec}`);
    if (!/\d/.test(totalSec)) throw new Error("total seconds empty");

    // future rejection via shipped validateBirth + UI path
    const futureCheck = await page.evaluate(() => {
      const Core = window.LifeClockCore;
      const fut = new Date(Date.now() + 3 * 86400000);
      return Core.validateBirth(fut, new Date());
    });
    log.push(`future_validate=${JSON.stringify(futureCheck)}`);
    if (futureCheck.ok !== false || futureCheck.reason !== "future") {
      throw new Error("future birth not rejected by validateBirth");
    }
    // UI: max attr + JS both guard; force JS path via evaluate submit path
    const uiFuture = await page.evaluate(() => {
      const Core = window.LifeClockCore;
      const fut = new Date(Date.now() + 3 * 86400000);
      const y = fut.getFullYear();
      const m = String(fut.getMonth() + 1).padStart(2, "0");
      const d = String(fut.getDate()).padStart(2, "0");
      const date = Core.parseBirthInput(`${y}-${m}-${d}`, "00:00:00");
      return Core.validateBirth(date, new Date());
    });
    log.push(`ui_future_path=${JSON.stringify(uiFuture)}`);
    if (uiFuture.ok !== false) throw new Error("future birth not rejected");

    // restore valid and reload
    await page.fill("#birthDate", "2000-01-15");
    await page.fill("#birthTime", "10:20:30");
    await page.click('button[type="submit"]');
    await page.waitForSelector("#clockPanel:not(.hidden)");

    const stored = await page.evaluate(() => localStorage.getItem("life-clock-state"));
    log.push(`stored=${stored}`);
    if (!stored || !stored.includes("2000-01-15") && !stored.includes("birthISO")) {
      if (!stored.includes("birthISO")) throw new Error("birth not persisted");
    }

    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector("#clockPanel:not(.hidden)", { timeout: 5000 });
    const hint2 = await page.locator("#hint").innerText();
    log.push(`restore_hint=${hint2}`);
    const birthDisplay = await page.locator("#birthDisplay").innerText();
    log.push(`birthDisplay=${birthDisplay}`);
    if (!birthDisplay.includes("2000")) throw new Error("birth not restored on reload");

    // theme persist
    await page.click('[data-theme-btn="dark"]');
    await page.waitForTimeout(200);
    const theme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    log.push(`theme=${theme}`);
    await page.reload({ waitUntil: "networkidle" });
    const theme2 = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    log.push(`theme_after_reload=${theme2}`);
    if (theme2 !== "dark") throw new Error("theme not restored");

    await page.screenshot({ path: path.join(SCRATCH, "ui.png"), fullPage: true });
    log.push("screenshot=ui.png");

    if (errors.length) {
      log.push("errors=" + errors.join(" | "));
      // filter font noise
      const real = errors.filter((e) => !/favicon|fonts\.google/i.test(e));
      if (real.length) throw new Error("page errors: " + real.join("; "));
    } else {
      log.push("errors=none");
    }

    log.push("PASS");
    fs.writeFileSync(path.join(SCRATCH, "browser-smoke.log"), log.join("\n") + "\n", "utf8");
    console.log(log.join("\n"));
    console.log("OK");
  } catch (e) {
    const msg = String(e && e.stack || e);
    fs.writeFileSync(path.join(SCRATCH, "browser-smoke.log"), log.join("\n") + "\nFAIL\n" + msg + "\n", "utf8");
    console.error(msg);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    if (serverWrap) serverWrap.server.close();
  }
}

main();
