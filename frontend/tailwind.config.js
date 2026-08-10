export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B1D33",
          gold: "#F5A623",
          ink: "#131A22",
        },
      },
      fontFamily: {
        display: ["'Amazon Ember'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
