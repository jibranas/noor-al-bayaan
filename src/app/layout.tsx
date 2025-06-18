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
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <Navigation />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-white shadow-sm py-4 mt-auto">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>
                Developed by your brother{' '}
                <a
                  href="https://www.youtube.com/@MrJustJib"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Jibran Asif Shareef
                </a>
              </p>
            </div>
          </footer>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
