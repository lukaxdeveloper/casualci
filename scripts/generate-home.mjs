import { readFileSync, writeFileSync } from "node:fs";
const html = readFileSync(new URL("../app/home.html", import.meta.url), "utf8");
const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];
if (!body) throw new Error("Home document has no body");
writeFileSync(new URL("../app/home-markup.ts", import.meta.url), `export const homeMarkup = ${JSON.stringify(body)};\n`);
