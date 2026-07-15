import { readFile, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const required = ["index.html", "privacy.html", "404.html", "robots.txt", "sitemap.xml", "assets/css/style.css", "assets/js/main.js", "config/site-config.js"];
const failures = [];

for (const file of required) {
  try { await access(resolve(root, file)); }
  catch { failures.push(`不足ファイル: ${file}`); }
}

const html = await readFile(resolve(root, "index.html"), "utf8");
const css = await readFile(resolve(root, "assets/css/style.css"), "utf8");
const js = await readFile(resolve(root, "assets/js/main.js"), "utf8");

const checks = [
  [/<title>.+<\/title>/s, "title"],
  [/<meta name="description"/, "meta description"],
  [/application\/ld\+json/, "構造化データ"],
  [/<h1[ >]/, "h1"],
  [/href="privacy\.html"/, "プライバシーリンク"],
  [/data-line-link/, "LINE設定連動"],
  [/data-consultation-form/, "相談フォーム"],
  [/name="website"/, "honeypot"],
  [/prefers-reduced-motion/, "動きを抑える設定"],
  [/@media \(max-width:640px\)/, "スマートフォン表示"],
  [/formEndpoint/, "フォーム送信先設定"],
  [/gaMeasurementId/, "アクセス解析設定"]
];

for (const [pattern, label] of checks) {
  const source = label === "動きを抑える設定" || label === "スマートフォン表示" ? css : label.includes("設定") && label !== "LINE設定連動" ? js : html;
  if (!pattern.test(source)) failures.push(`確認できません: ${label}`);
}

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.has(match[1])) failures.push(`リンク先がありません: #${match[1]}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("静的サイトの基本チェック: すべて合格");
}
