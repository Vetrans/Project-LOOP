/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0A0D14",
          900: "#0F1420",
          800: "#161C2C",
          700: "#1F273A",
          600: "#2A3349",
          500: "#3A4560",
        },
        mist: {
          400: "#6B7690",
          300: "#8B96AD",
          200: "#B7BFD1",
          100: "#E4E8F1",
        },
        loop: {
          violet: "#7C6FF0",
          violetDim: "#5B4FC4",
          teal: "#2DD9B9",
          coral: "#FB7185",
          amber: "#F5B043",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.5)",
        glow: "0 0 0 1px rgba(124,111,240,0.35), 0 0 24px -4px rgba(124,111,240,0.45)",
      },
      backgroundImage: {
        "loop-radial": "radial-gradient(circle at 30% 20%, rgba(124,111,240,0.18), transparent 55%)",
      },
    },
  },
  plugins: [],
};
