import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [forms({ strategy: "base" })],
} satisfies Config;
