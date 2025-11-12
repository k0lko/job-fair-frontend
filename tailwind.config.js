export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pb: {
          red: "#830e21", // główny kolor Politechniki Bydgoskiej
          lightRed: "#a61a32",
          white: "#ffffff",
          gray: "#f4f4f4",
        },
      },
      fontFamily: {
        sans: ['"Saira"', "sans-serif"], // font
      },
    },
  },
  plugins: [],
};
