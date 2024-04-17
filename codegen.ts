import { writeFileSync, mkdirSync, rmSync, existsSync } from "fs";

rmSync("src", { recursive: true, force: true });
mkdirSync("./src");

const generate = (
  count: number,
  dir: string,
  ext: string,
  nextImp: (i: number) => string,
) => {
  if (!existsSync(`./src/${count}`)) {
    mkdirSync(`./src/${count}`);
  }
  mkdirSync(`./src/${count}/${dir}`);
  for (let i = 1; i < count; i++) {
    writeFileSync(
      `src/${count}/${dir}/${i}.${ext}`,
      `import "${nextImp(i + 1)}"`,
    );
  }
  writeFileSync(
    `src/${count}/${dir}/last.${ext}`,
    `
const app = document.createElement("div");
app.id = "app";
app.textContent = "Hello world";
document.body.appendChild(app);
`,
  );
};

/**
 * Generating test projects of various size to see,
 * how ESM-first approach changes in dynamic
 */
for (const count of [10, 100, 1_000, 5_000, 8_000, 10_000]) {
  generate(count, "esm", "js", (i) => `/src/esm/${i}.js`);
  generate(count, "js", "js", (i) => `./${i}`);
  generate(count, "ts", "ts", (i) => `./${i}`);
}
