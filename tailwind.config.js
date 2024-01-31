/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        100: "475px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
