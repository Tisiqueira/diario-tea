import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Diário TEA",
  description:
    "Acompanhe e registre a evolução diária de crianças autistas de forma simples e carinhosa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <link
        className="rounded-full w-32 h-32 "
        rel="icon"
        type="image/png"
        href="/favicon.png"
      />

      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
