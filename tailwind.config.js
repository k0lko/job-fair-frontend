export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pb: {
          red: "#830e21",       // główny kolor PB
          lightRed: "#a61a32",
          white: "#ffffff",
          gray: "#f4f4f4",
        },
      },

      fontFamily: {
        sans: ['"Saira"', "sans-serif"],
      },

      animation: {
        "scroll-infinite": "scroll 20s linear infinite",
      },

      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
