import type { Metadata } from "next";
import "./globals.css";
import { gameTitle, text, poppins } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { WebsocketProvider } from "@/features/websocket/websocket-context";
import { AuthProvider } from "@/features/auth/auth-context";
import { NotificationProvider } from "@/features/notification-context";

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
        className={`${gameTitle.variable} ${text.variable} ${poppins.variable} antialiased`} 
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <WebsocketProvider>
              <NotificationProvider>
                <Toaster/>
                {children}
              </NotificationProvider>
            </WebsocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}