// scripts/generate-guides-index.mjs
// Emits a title→slug index of every KB guide, for the gateway to match against.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";

const KB = join(process.cwd(), "content/kb");
const out = [];

// Strips the outer quotes AND un-escapes interior ones. One of the 98
// frontmatter titles contains \" escapes, and leaving them in puts literal
// backslashes into a message a Hebrew-speaking customer reads.
const unquote = (s) => {
  const t = s.trim();
  const m = t.match(/^"([\s\S]*)"$/) || t.match(/^'([\s\S]*)'$/);
  return (m ? m[1] : t).replace(/\\(["'\\])/g, "$1");
};

for (const file of readdirSync(KB).filter((f) => f.endsWith(".md")).sort()) {
  const raw = readFileSync(join(KB, file), "utf8");
  const fm = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const stem = basename(file, ".md");

  const title = unquote(fm.match(/^title:\s*(.+)$/m)?.[1] ?? stem);

  // The slug MUST come from frontmatter: gatsby-node.ts builds the page as
  // `/kb/${guide.frontmatter.slug}/`, and one of the 98 guides has a slug
  // ending in an emoji that the filename flattens to a hyphen. Deriving the
  // slug from the filename sends a customer to a 404.
  const slug = unquote(fm.match(/^slug:\s*(.+)$/m)?.[1] ?? stem);
  if (slug !== stem) {
    console.warn(`  slug differs from filename: ${stem} -> ${slug}`);
  }

  out.push({ title, slug });
}

writeFileSync(process.argv[2] ?? "guides.json", JSON.stringify(out, null, 2) + "\n");
console.log(`wrote ${out.length} guides`);
