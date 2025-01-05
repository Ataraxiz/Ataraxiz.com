/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html", 
    "./src/**/*.html",
    "./pages/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        darkCyan: "#006969",
      },
    },
  },
  plugins: [],
};


