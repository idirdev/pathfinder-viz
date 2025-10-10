import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        wall: "#1e293b",
        start: "#22c55e",
        end: "#ef4444",
        visited: "#818cf8",
        path: "#facc15",
        frontier: "#38bdf8",
      },
    },
  },
  plugins: [],
};

export default config;
