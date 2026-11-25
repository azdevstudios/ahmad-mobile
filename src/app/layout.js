import {
  Plus_Jakarta_Sans,
  DM_Sans,
  JetBrains_Mono,
} from "next/font/google";

import "./globals.css";
import ThemeProvider from "@/components/layout/ThemeProvider";
import RootLayoutContent from "@/components/layout/RootLayoutContent";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Ahmed Mobile | Smartphones & Repair Lab",
  description:
    "Discover smartphones, easy installments and professional mobile repair services at Ahmed Mobile.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${dmSans.variable} ${jetbrains.variable} min-h-screen antialiased`}>
        <ThemeProvider>
          <RootLayoutContent>
            {children}
          </RootLayoutContent>
        </ThemeProvider>
      </body>
    </html>
  );
}
