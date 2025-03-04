import { Jersey_10, Ribeye, Audiowide, Poppins, Roboto_Serif } from "next/font/google";

export const gameTitle = Jersey_10({
  variable: "--font-jersey10",
  weight: "400",
  subsets: ["latin"]
});

export const poppins = Poppins({
  variable: "--font-poppins",
  weight: "400",
  subsets: ["latin"]
});

export const titlesDay = Ribeye({
  variable: "--font-ribeye",
  weight: "400",
  subsets: ["latin"]
});

export const titlesNight = Audiowide({
  variable: "--font-audiowide",
  weight: "400",
  subsets: ["latin"]
});

export const text = Roboto_Serif({
  variable: "--font-roboto-serif",
  subsets: ["latin"]
});