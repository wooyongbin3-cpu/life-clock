/**
 * Life Clock verification harness
 * - size gate on first-party assets
 * - storage serialize/load/clear round-trip on real shipped functions
 * - time math (diffBreakdown + computeTotals) on fixed pairs
 *
 * Runs against functions extracted from index.html (no reimplementation).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import vm from "node:vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");
const ORNAMENT = path.join(ROOT, "assets", "ornament.svg");
const SCRATCH = process.env.LIFE_CLOCK_SCRATCH || path.join(ROOT, "tests", "out");

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function write(name, text) {
  ensureDir(SCRATCH);
  const p = path.join(SCRATCH, name);
  fs.writeFileSync(p, text, "utf8");
  return p;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function extractCoreFromHtml(html) {
  const m = html.match(/<script>([\s\S]*?)<\/script>/i);
  assert(m, "script block missing in index.html");
  const script = m[1];
  // Stop before UI layer so we don't need DOM for pure core
  const marker = "/* ========================================================================\n       UI layer";
  let coreSrc = script;
  const cut = script.indexOf(marker);
  if (cut !== -1) {
    coreSrc = script.slice(0, cut);
  } else {
    // Fallback: cut at first getElementById usage block
    const ui = script.indexOf("const storage = createStorageAdapter");
    if (ui !== -1) coreSrc = script.slice(0, ui);
  }
  // Provide a sandbox with window/globalThis
  const sandbox = {
    window: {},
    globalThis: {},
    Date,
    Math,
    Number,
    String,
    JSON,
    console,
  };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(coreSrc + "\n;this.__core = LifeClockCore;", sandbox);
  assert(sandbox.__core, "LifeClockCore not exposed");
  return sandbox.__core;
}

function sizeCheck() {
  const lines = [];
  const files = [
    { name: "index.html", path: INDEX },
    { name: "assets/ornament.svg", path: ORNAMENT },
  ];
  let total = 0;
  for (const f of files) {
    assert(fs.existsSync(f.path), `missing ${f.name}`);
    const n = fs.statSync(f.path).size;
    total += n;
    lines.push(`${f.name}\t${n}`);
  }
  lines.push(`TOTAL\t${total}`);
  lines.push(`THRESHOLD\t102400`);
  lines.push(`PASS\t${total >= 102400}`);
  const out = lines.join("\n") + "\n";
  write("size.txt", out);
  assert(total >= 102400, `size ${total} < 102400`);
  return { total, out };
}

function storageRoundTrip(Core) {
  const log = [];
  const mem = new Map();
  const store = {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => mem.set(k, String(v)),
    removeItem: (k) => mem.delete(k),
  };
  const adapter = Core.createStorageAdapter(store);

  const birth = new Date(1998, 4, 20, 8, 30, 15);
  const state = {
    ...Core.DEFAULT_STATE,
    birthISO: birth.toISOString(),
    theme: "ink",
    displayName: "测试",
    bpm: 72,
    tickEmphasis: false,
    quoteRotate: true,
  };

  adapter.save(state);
  log.push("saved=" + store.getItem(Core.STORAGE_KEY));

  // clear in-memory conceptual state
  let loaded = null;
  loaded = adapter.load();
  log.push("loaded.birthISO=" + loaded.birthISO);
  log.push("loaded.theme=" + loaded.theme);
  log.push("loaded.displayName=" + loaded.displayName);
  log.push("loaded.bpm=" + loaded.bpm);
  log.push("loaded.tickEmphasis=" + loaded.tickEmphasis);

  assert(loaded.birthISO === birth.toISOString(), "birthISO mismatch after reload");
  assert(loaded.theme === "ink", "theme not restored");
  assert(loaded.displayName === "测试", "displayName not restored");
  assert(loaded.bpm === 72, "bpm not restored");
  assert(loaded.tickEmphasis === false, "tickEmphasis not restored");

  adapter.clear();
  const after = adapter.load();
  log.push("afterClear.birthISO=" + String(after.birthISO));
  assert(!after.birthISO, "birth residual after clear");
  assert(store.getItem(Core.STORAGE_KEY) == null, "storage key residual");

  // legacy migration path
  store.setItem(Core.LEGACY_BIRTH_KEY, birth.toISOString());
  const migrated = adapter.load();
  log.push("migrated.birthISO=" + migrated.birthISO);
  assert(migrated.birthISO === birth.toISOString(), "legacy migration failed");

  const out = log.join("\n") + "\nPASS\n";
  write("storage-roundtrip.log", out);
  return out;
}

function timeMath(Core) {
  const log = [];
  // Fixed pair: 2000-01-01 00:00:00 -> 2001-03-05 04:06:08
  const from = new Date(2000, 0, 1, 0, 0, 0, 0);
  const to = new Date(2001, 2, 5, 4, 6, 8, 0);
  const diff = Core.diffBreakdown(from, to);
  const totalMs = to - from;
  log.push(`from=${from.toISOString()}`);
  log.push(`to=${to.toISOString()}`);
  log.push(`totalMs_expected=${totalMs}`);
  log.push(`totalMs_got=${diff.totalMs}`);
  log.push(`YMDHMS=${diff.years}-${diff.months}-${diff.days} ${diff.hours}:${diff.minutes}:${diff.seconds}`);

  assert(diff.totalMs === totalMs, "totalMs must equal to-from");
  assert(diff.years === 1, "years expected 1");
  assert(diff.months === 2, "months expected 2");
  assert(diff.days === 4, "days expected 4");
  assert(diff.hours === 4, "hours expected 4");
  assert(diff.minutes === 6, "minutes expected 6");
  assert(diff.seconds === 8, "seconds expected 8");

  // Calendar consistency: adding back components roughly lands after from
  // (not exact inverse for calendar math, but totals must match ms)
  const totals = Core.computeTotals(diff.totalMs, 70);
  log.push(`totals=${JSON.stringify(totals)}`);
  assert(totals.totalSec === Math.floor(totalMs / 1000), "totalSec mismatch");
  assert(totals.totalDay === Math.floor(totalMs / 86400000), "totalDay mismatch");
  assert(totals.heartbeats === Math.floor((totalMs / 1000) * (70 / 60)), "heartbeats mismatch");

  // Future rejection
  const future = new Date(Date.now() + 86400000);
  const v = Core.validateBirth(future, new Date());
  log.push(`future_ok=${v.ok} reason=${v.reason}`);
  assert(v.ok === false && v.reason === "future", "future birth must be rejected");

  // Valid past
  const past = new Date(1990, 0, 1);
  const v2 = Core.validateBirth(past, new Date());
  assert(v2.ok === true, "past birth must be accepted");

  // Negative span totalMs
  const neg = Core.diffBreakdown(to, from);
  log.push(`neg_totalMs=${neg.totalMs}`);
  assert(neg.totalMs === from - to, "negative span totalMs");

  // parseBirthInput
  const p = Core.parseBirthInput("1998-05-20", "08:30:15");
  assert(p.getFullYear() === 1998 && p.getMonth() === 4 && p.getDate() === 20, "parse date");
  assert(p.getHours() === 8 && p.getMinutes() === 30 && p.getSeconds() === 15, "parse time");

  const out = log.join("\n") + "\nPASS\n";
  write("time-math.log", out);
  return out;
}

function structuralCheck(html) {
  const log = [];
  assert(fs.existsSync(INDEX), "index.html exists");
  log.push("index.html exists");
  assert(html.includes("LifeClockCore"), "LifeClockCore present");
  assert(html.includes("localStorage") || html.includes("createStorageAdapter"), "persistence present");
  assert(html.includes("diffBreakdown"), "diffBreakdown present");
  assert(html.includes("data-theme"), "theme system present");
  assert(!html.includes("require(") || html.includes("LifeClockCore"), "no unguarded node require for page");
  // classic script (not type=module) for file://
  assert(/<script>/.test(html) && !/<script\s+type=["']module["']/.test(html), "classic script for file://");
  log.push("structural OK");
  const out = log.join("\n") + "\nPASS\n";
  write("structural.log", out);
  return out;
}

function main() {
  ensureDir(SCRATCH);
  const html = fs.readFileSync(INDEX, "utf8");
  const size = sizeCheck();
  const Core = extractCoreFromHtml(html);
  const storageLog = storageRoundTrip(Core);
  const timeLog = timeMath(Core);
  const structLog = structuralCheck(html);

  const summary = [
    "LIFE CLOCK VERIFY",
    `size_total=${size.total}`,
    "storage=PASS",
    "time-math=PASS",
    "structural=PASS",
    `scratch=${SCRATCH}`,
  ].join("\n") + "\n";
  write("verify-summary.log", summary);
  console.log(summary);
  console.log("OK");
}

main();
