import { glob, readFile, writeFile } from "node:fs/promises";
import { parseSync, Visitor } from "oxc-parser";
import { print } from "esrap";
import ts from "esrap/languages/ts";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

const files = glob("./src/**/*.js");

const results = {};
let counter = 0;
const visitor = new Visitor({
  TaggedTemplateExpression(tmpl) {
    if (
      (tmpl.tag.object.name === "FES" && tmpl.tag.property.name === "log") ||
      (tmpl.tag.object.object?.name === "p5" &&
        tmpl.tag.object.property.name === "FES" &&
        tmpl.tag.property.name === "log") ||
      (tmpl.tag.object.name === "TL" && tmpl.tag.property.name === "tl")
    ) {
      const extracted = print(tmpl.quasi, ts()).code.replaceAll(/^`|`$/g, "");

      // Dedupe and remove placeholder only entries
      const stringCompare = Object.values(results).map((value) =>
        value.replaceAll(/\$\{.+?\}/g, "_"),
      );

      if (
        !Object.values(results).includes(extracted) &&
        !extracted.match(/^\$\{.+?\}$/) &&
        !stringCompare.includes(extracted.replaceAll(/\$\{.+?\}/g, "_"))
      ) {
        results[nanoid()] = extracted;
        counter++;
      }
    } else {
      console.log("False match", tmpl.tag);
    }
  },
});

for await (const file of files) {
  const ast = parseSync(file, await readFile(file, { encoding: "utf8" }));
  visitor.visit(ast.program);
}

// Only write new strings
const currentFile = JSON.parse(await readFile("./translations/en/extracted.json"));
const currentStrings = Object.values(currentFile).reduce((acc, value) => {
  if (typeof value === "string") {
    acc.push(value.replaceAll(/\$\{.+?\}/g, "_"));
  } else {
    // TODO: This is only one level deep, probably should be arbitrary depth
    acc.push(
      ...Object.values(value).map((v) => v.replaceAll(/\$\{.+?\}/g, "_")),
    );
  }

  return acc;
}, []);
const newResults = Object.entries(results).reduce((acc, [key, value]) => {
  const newString = value.replaceAll(/\$\{.+?\}/g, "_");
  if (!currentStrings.includes(newString)) {
    acc[nanoid()] = value;
  }
  return acc;
}, {});
const data = Object.assign(currentFile, newResults);

await writeFile("./translations/en/extracted.json", JSON.stringify(data, null, 2));
// console.log(newResults);
console.log(
  `Extracted ${Object.keys(newResults).length} strings, please manually review the extracted strings and change placeholder names where relevant`,
);
