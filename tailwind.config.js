import { platformSelect } from "nativewind/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "rubik-thin": ["rubik-thin"],
        "rubik-regular": ["rubik-regular"],
        "rubik-medium": ["rubik-medium"],
        "rubik-semibold": ["rubik-semibold"],
        "rubik-bold": ["rubik-bold"],
        "rubik-extrabold": ["rubik-extrabold"],
        "rubik-black": ["rubik-black"],
        system: platformSelect({
          default: "rubik",
        }),
      },
    },
  },
  plugins: [],
};
