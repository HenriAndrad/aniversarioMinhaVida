/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        noite: "#0A0D18",
        meianoite: "#131829",
        superficie: "#1A2138",
        pergaminho: "#F0EAE0",
        nevoa: "#9298AC",
        ouro: "#D9B87C",
        ourosuave: "#E8D5AE",
        lilas: "#A99BC9",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        body: ["'Figtree'", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose2: "38rem",
      },
    },
  },
  plugins: [],
};
