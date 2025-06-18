import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Noor Al Bayaan - Learn Arabic Vocabulary",
  description: "Interactive flash cards to help you learn Arabic vocabulary from Noor Al Bayaan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navigation />
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
