import type { Metadata } from "next";
import "./globals.css";
import { gameTitle, text, titlesDay, titlesNight } from "@/lib/fonts";

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
        className={`${gameTitle.variable} ${titlesDay.variable}  ${text.variable} antialiased`} 
      >
        {children}
      </body>
    </html>
  );
}

//${gameTitle.variable} ${titlesDay.variable} ${titlesNight.variable} 
