const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss-react-aria-components"),
    plugin(function ({ addVariant }) {
      addVariant("dark-mode", "&:where(.dark-mode, .dark-mode *)");
      addVariant("label", "& [data-label]");
      addVariant("focus-input-within", "&:has(input:focus)");
    }),
  ],
};
