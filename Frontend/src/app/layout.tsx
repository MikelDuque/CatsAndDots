import type { Metadata } from "next";
import "./globals.css";
import { gameTitle, text } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { WebsocketProvider } from "@/features/websocket/websocket-context";
import { AuthProvider } from "@/features/auth/auth-context";
import { ModalProvider } from "@/features/modal/ModalContext";

export const metadata: Metadata = {
  title: "Cats & Dots",
  description: "Play the infamous game \"Dots and Boxes\" with kitties!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body suppressHydrationWarning
        className={`${gameTitle.variable} ${text.variable} antialiased`} 
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <WebsocketProvider>
              <Toaster/>
              <ModalProvider>
                {children}
              </ModalProvider>
            </WebsocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}