export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#202124",
        cloud: "#f8fafc",
        signal: "#0f9d8f",
        signalDark: "#0b6f66",
        amber: "#f5a524",
        rose: "#e5484d"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(32, 33, 36, 0.08)"
      }
    }
  },
  plugins: []
};

