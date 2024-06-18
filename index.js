const color = require("color");

const rgbStringFunctionRegex = /(rgbstring)\(/i;
const rgbStringValueRegex = /rgbstring\(([^)]+)\)/i;

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = () => {
  return {
    postcssPlugin: "postcss-plugin-rgbstring",
    Declaration: (decl) => {
      if (!decl.variable) return;

      const originalValue = decl.value;
      if (!rgbStringFunctionRegex.test(originalValue)) return;

      try {
        const [, matchedValue = ""] =
          originalValue.match(rgbStringValueRegex) ?? [];
        const parsed = color(matchedValue).rgb().array().slice(0, 3);

        decl.cloneBefore({
          value: originalValue.replace(rgbStringValueRegex, parsed.join(", ")),
        });
        decl.remove();
      } catch {
        throw new Error(
          `[postcss-plugin-rgbstring] Failed to parse color ${originalValue}`
        );
      }
    },
  };
};

module.exports.postcss = true;
