#!/usr/bin/env node
import { readFileSync } from "node:fs";

const TELEGRAM_LIMIT = 3900;

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const text = buildMessage(args);
  const token = firstEnv("LLPHANT_TG_BOT_TOKEN", "LLPHANT_TELEGRAM_BOT_TOKEN", "TELEGRAM_BOT_TOKEN_LLPHANT", "TELEGRAM_BOT_TOKEN");
  const chatId = firstEnv("LLPHANT_TG_CHAT_ID", "LLPHANT_TELEGRAM_CHAT_ID", "TELEGRAM_CHAT_ID");
  const threadId = firstEnv("LLPHANT_TG_THREAD_ID", "LLPHANT_TELEGRAM_THREAD_ID", "TELEGRAM_MESSAGE_THREAD_ID");

  if (!token || !chatId) {
    console.log("LLPhant Telegram alert skipped: missing bot token or chat id secret.");
    return;
  }

  const body = {
    chat_id: chatId,
    text: text.slice(0, TELEGRAM_LIMIT),
    disable_web_page_preview: false,
  };
  if (threadId) body.message_thread_id = Number.isNaN(Number(threadId)) ? threadId : Number(threadId);

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(`LLPhant Telegram alert failed: ${data.description ?? `HTTP ${response.status}`}`);
  }
  console.log("LLPhant Telegram alert sent.");
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--tour-pr") args.tourPr = true;
    else if (arg === "--failure") args.failure = true;
    else if (arg === "--summary-file") args.summaryFile = requireValue(argv, ++i, arg);
    else if (arg === "--text") args.text = requireValue(argv, ++i, arg);
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function buildMessage(args) {
  if (args.text) return args.text;
  if (args.failure) {
    return [
      "RIBS Bandsintown sync failed.",
      process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
        ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
        : "",
    ].filter(Boolean).join("\n");
  }
  if (args.tourPr) return buildTourPrMessage(args.summaryFile);
  throw new Error("Provide --tour-pr, --failure, or --text.");
}

function buildTourPrMessage(summaryFile) {
  const summary = summaryFile ? JSON.parse(readFileSync(summaryFile, "utf8")) : {};
  const prUrl = process.env.PR_URL || process.env.PULL_REQUEST_URL || "";
  const prNumber = process.env.PR_NUMBER || process.env.PULL_REQUEST_NUMBER || "";
  const repo = process.env.GITHUB_REPOSITORY || "aklo360/ribs";
  const runUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : "";

  return [
    `RIBS tour sync opened PR${prNumber ? ` #${prNumber}` : ""}.`,
    prUrl,
    "",
    `Repo: ${repo}`,
    `Added: ${summary.added?.length ?? 0}`,
    `Changed: ${summary.changedShows?.length ?? 0}`,
    `Removed: ${summary.removed?.length ?? 0}`,
    `Next shows: ${summary.nextCount ?? "unknown"}`,
    runUrl ? `Run: ${runUrl}` : "",
  ].filter((line) => line !== "").join("\n");
}

function firstEnv(...names) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

function requireValue(argv, index, flag) {
  const value = argv[index];
  if (!value) throw new Error(`${flag} requires a value.`);
  return value;
}

function printHelp() {
  console.log([
    "Usage:",
    "  node scripts/notify-llphant-tg.mjs --tour-pr --summary-file /tmp/tour-summary.json",
    "  node scripts/notify-llphant-tg.mjs --failure",
    "  node scripts/notify-llphant-tg.mjs --text 'message'",
  ].join("\n"));
}
