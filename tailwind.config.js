/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#121212",
        "card-bg": "#1E1E1E",
        accent: "#2563EB",
      },
    },
  },
  plugins: [],
};
