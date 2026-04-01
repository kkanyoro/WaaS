import type { Metadata } from "next";
import { Inter, Great_Vibes } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { siteConfig } from "@/config/weddingConfig";

const inter = Inter({ subsets: ["latin"] });

// Configure calligraphy font and set CSS variable name
const calligraphy = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-calligraphy',
});

export const metadata: Metadata = {
  title: `${siteConfig.coupleNames} | Wedding Invitation`,
  description: `Join us to celebrate the wedding of ${siteConfig.coupleNames}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Add the font variable to body*/}
      <body className={`${inter.className} ${calligraphy.variable}`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}