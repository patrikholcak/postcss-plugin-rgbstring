const postcss = require("postcss");
const { equal, rejects } = require("node:assert");
const { test } = require("node:test");
const tailwindcss = require("tailwindcss");

const rgbStringPlugin = require("./");

const defaultPlugins = [rgbStringPlugin()];
const withTailwind = [tailwindcss(), rgbStringPlugin()];

async function run(input, output, plugins = defaultPlugins) {
  let result = await postcss(plugins).process(input, {
    from: undefined,
  });
  equal(result.css, output);
  equal(result.warnings().length, 0);
}

test("transforms css variables", async () => {
  await run("--color: rgbstring(#f00);", "--color: 255, 0, 0;");
  await run(
    ":root { --color: rgbstring(#f00); }",
    ":root { --color: 255, 0, 0; }"
  );
  await run(
    ".content { --color: rgbstring(#f00); }",
    ".content { --color: 255, 0, 0; }"
  );
  await run(
    ":root { --color: rgbstring(#f00); }; .content { --color: rgbstring(#f00); }",
    ":root { --color: 255, 0, 0; }; .content { --color: 255, 0, 0; }"
  );
});

test("transforms scss variables", async () => {
  await run("$color: rgbstring(#f00);", "$color: 255, 0, 0;");
  await run(
    ":root { $color: rgbstring(#f00); }",
    ":root { $color: 255, 0, 0; }"
  );
  await run(
    ".content { $color: rgbstring(#f00); }",
    ".content { $color: 255, 0, 0; }"
  );
  await run(
    ":root { $color: rgbstring(#f00); }; .content { $color: rgbstring(#f00); }",
    ":root { $color: 255, 0, 0; }; .content { $color: 255, 0, 0; }"
  );
});

test("transforms tailwind", async () => {
  await run(
    ":root { --color: rgbstring(theme(colors.gray.500)); }",
    ":root { --color: 107, 114, 128; }",
    withTailwind
  );
  await run(
    ":root { $color: rgbstring(theme(colors.gray.500)); }",
    ":root { $color: 107, 114, 128; }",
    withTailwind
  );
  await run(
    ":root { @apply [--color:rgbstring(theme(colors.gray.500))] dark:[--bg-primary:rgbstring(theme(colors.gray.900))]; }",
    ":root {\n    --color: 107, 114, 128\n}\n@media (prefers-color-scheme: dark) {\n    :root {\n        --bg-primary: 17, 24, 39\n    }\n}",
    withTailwind
  );
});

test("throws", async () => {
  rejects(() => run(":root { --color: rgbstring( ); }"));
});

test("ignores unrelated", async () => {
  await run(":root { rgbstring: #f00; }", ":root { rgbstring: #f00; }");
  await run(".content { rgbstring: #f00; }", ".content { rgbstring: #f00; }");
});
