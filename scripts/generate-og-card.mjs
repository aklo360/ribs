import {
  copyFile,
  mkdtemp,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const width = 1200;
const height = 630;

function dataUri(data, mime) {
  return `data:${mime};base64,${Buffer.from(data).toString("base64")}`;
}

async function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      await readFile(candidate);
      return candidate;
    } catch {
      // Continue looking.
    }
  }

  throw new Error("Chrome not found. Set CHROME_PATH to render the OG card.");
}

const [logoData, coverData, syneData] = await Promise.all([
  readFile(join(root, "public/img/logo.png")),
  readFile(join(root, "public/img/releases/break-down.jpg")),
  readFile(join(root, "public/fonts/syne-variable.ttf")),
]);

const logo = dataUri(logoData, "image/png");
const cover = dataUri(coverData, "image/jpeg");
const syne = dataUri(syneData, "font/ttf");

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @font-face {
        font-family: "Syne OG";
        src: url("${syne}") format("truetype");
        font-weight: 600 800;
        font-style: normal;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        width: ${width}px;
        height: ${height}px;
        margin: 0;
        overflow: hidden;
        background: #000;
      }

      body {
        font-family: "Syne OG", Arial, Helvetica, sans-serif;
        color: #f5f5f6;
      }

      .card {
        position: relative;
        width: ${width}px;
        height: ${height}px;
        overflow: hidden;
        background: #000;
      }

      .wash-cover {
        position: absolute;
        top: -112px;
        right: -150px;
        width: 760px;
        height: 760px;
        object-fit: cover;
        opacity: 0.14;
      }

      .black-sweep,
      .corner-wash {
        position: absolute;
        inset: 0;
      }

      .black-sweep {
        background: linear-gradient(
          90deg,
          rgba(0, 0, 0, 0.99) 0%,
          rgba(0, 0, 0, 0.93) 46%,
          rgba(0, 0, 0, 0.68) 72%,
          rgba(0, 0, 0, 0.97) 100%
        );
      }

      .corner-wash {
        background: linear-gradient(
          135deg,
          rgba(245, 245, 246, 0.12) 0%,
          rgba(245, 245, 246, 0.035) 19%,
          rgba(245, 245, 246, 0) 48%
        );
      }

      .cover-ghost,
      .cover-card {
        position: absolute;
        width: 424px;
        height: 424px;
        border: 1px solid rgba(245, 245, 246, 0.18);
      }

      .cover-ghost {
        right: 74px;
        top: 92px;
        background: rgba(245, 245, 246, 0.04);
      }

      .cover-card {
        right: 96px;
        top: 92px;
        background: rgba(245, 245, 246, 0.06);
        border-color: rgba(245, 245, 246, 0.3);
        box-shadow: 0 34px 120px rgba(0, 0, 0, 0.72);
      }

      .cover-card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .logo {
        position: absolute;
        left: 76px;
        top: 142px;
        width: 420px;
        height: 224px;
        object-fit: contain;
        object-position: left top;
      }

      .tagline {
        position: absolute;
        left: 76px;
        top: 404px;
        font-size: 44px;
        line-height: 0.94;
        font-weight: 800;
        letter-spacing: 0;
      }

      .tagline span {
        display: block;
      }
    </style>
  </head>
  <body>
    <main class="card">
      <img class="wash-cover" src="${cover}" alt="" />
      <div class="black-sweep"></div>
      <div class="corner-wash"></div>
      <div class="cover-ghost"></div>
      <div class="cover-card"><img src="${cover}" alt="Break Down cover art" /></div>
      <img class="logo" src="${logo}" alt="Roots in Blue Stone" />
      <div class="tagline">
        <span>Groove, Grit</span>
        <span>&amp; Good Vibes</span>
      </div>
    </main>
  </body>
</html>`;

const tempDir = await mkdtemp(join(tmpdir(), "ribs-og-"));
const htmlPath = join(tempDir, "og.html");
const outputPath = join(root, "public/img/social/og-card.png");

try {
  await writeFile(htmlPath, html);
  const chrome = await findChrome();
  const chromeArgs = [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${join(tempDir, "chrome-profile")}`,
    `--window-size=${width},${height}`,
    "--force-device-scale-factor=1",
    `--screenshot=${outputPath}`,
    `file://${htmlPath}`,
  ];

  try {
    await execFileAsync(chrome, chromeArgs, {
      timeout: 10_000,
      killSignal: "SIGTERM",
    });
  } catch (error) {
    try {
      await stat(outputPath);
    } catch {
      throw error;
    }
  }

  await copyFile(outputPath, join(root, "public/img/social/twitter-card.png"));
} finally {
  await execFileAsync("pkill", ["-f", tempDir]).catch(() => {});
  await rm(tempDir, { recursive: true, force: true });
}
