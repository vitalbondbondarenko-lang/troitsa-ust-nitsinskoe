#!/usr/bin/env node
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NEWS } from "../src/siteData.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const client = path.join(root, "dist", "client");
const index = path.join(client, "index.html");

const routes = [
  "o-khrame",
  "o-khrame/istoriya",
  "o-khrame/nastoyatel",
  "o-khrame/svyatyni",
  "o-khrame/svyatyni/venetskaya-ikona",
  "o-khrame/vosstanovlenie",
  "bogosluzheniya/raspisanie",
  "bogosluzheniya/tainstva-i-treby",
  "bogosluzheniya/kak-podat-zapisku",
  "treby-online",
  "novosti",
  ...NEWS.map((item) => `novosti/${item.slug}`),
  "prikhodskaya-zhizn",
  "prikhodskaya-zhizn/voskresnaya-shkola",
  "prikhodskaya-zhizn/sotsialnaya-pomoshch",
  "prikhodskaya-zhizn/volonterstvo",
  "prikhodskaya-zhizn/semya-i-prazdniki",
  "media/foto",
  "palomnikam",
  "pozhertvovat",
  "kontakty",
  "documents",
  "karta-sayta",
];

for (const route of routes) {
  const directory = path.join(client, route);
  mkdirSync(directory, { recursive: true });
  copyFileSync(index, path.join(directory, "index.html"));
}

copyFileSync(index, path.join(client, "404.html"));
console.log(`Prepared ${routes.length} static route entry points and 404.html`);
