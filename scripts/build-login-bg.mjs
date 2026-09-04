import fs from "node:fs";
import path from "node:path";

const sourceDir = path.join(process.cwd(), "assets", "login-bg-v7");
const outputPath = path.join(process.cwd(), "public", "hannune-login-background-hd.webp");

const chunks = fs
  .readdirSync(sourceDir)
  .filter((name) => name.startsWith("chunk-") && name.endsWith(".txt"))
  .sort()
  .map((name) => fs.readFileSync(path.join(sourceDir, name), "utf8").trim());

if (chunks.length !== 6) {
  throw new Error(`Expected 6 login background chunks, found ${chunks.length}`);
}

const image = Buffer.from(chunks.join(""), "base64");

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, image);

console.log(`Generated ${outputPath} (${image.length} bytes)`);

if (image.length < 30000) {
  throw new Error(`Generated login background is unexpectedly small: ${image.length} bytes`);
}
