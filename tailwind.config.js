/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        100: "475px",
        110: "550px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
