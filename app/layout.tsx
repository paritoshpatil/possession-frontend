'use client'
import type { Metadata } from "next";
import { Inter, Inconsolata } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navBar";
import Providers from "./providers";
import { ThemeProvider } from "./themeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});
const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata"
})

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${inter.variable} ${inconsolata.variable} `}>
        {/* <Providers> */}
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <NavBar />
            {children}
          </ThemeProvider>
        {/* </Providers> */}
      </body>
    </html>
  );
}
