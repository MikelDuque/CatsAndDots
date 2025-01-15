import type { Metadata } from "next";
import { Jersey_10, Ribeye, Audiowide, Roboto_Serif } from "next/font/google";
import "./globals.css";

/*
const gameTitle = Jersey_10({
  variable: "--font-jersey10",
  subsets: ["latin"]
});

const titlesDay = Ribeye({
  variable: "--font-ribeye",
  subsets: ["latin"]
});

const titlesNight = Audiowide({
  variable: "--font-audiowide",
  subsets: ["latin"]
});
*/
const text = Roboto_Serif({
  variable: "--font-roboto-serif",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Cats & Dots",
  description: "Play the infamous game \"Dots and Boxes\" with kitties!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${text.variable} antialiased`} 
      >
        {children}
      </body>
    </html>
  );
}

//${gameTitle.variable} ${titlesDay.variable} ${titlesNight.variable} 
