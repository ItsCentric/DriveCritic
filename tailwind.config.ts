import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Assistant", ...fontFamily.sans],
      },
      colors: {
          text: "#030501",
          background: "#F8FDF1",
          primary: "#B8EE77",
          secondary: "#E7F9D2",
          accent: "#89E31C",
          success: "#20E31C",
          error: "#EE777C",
          rating: "#EEE977",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
} satisfies Config;
