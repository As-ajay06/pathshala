import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LearnFlow - Smart Teaching & Learning Platform",
  description: "A scalable digital education ecosystem connecting educators and learners through personalized and interactive learning experiences.",
  keywords: ["learning", "education", "courses", "teaching", "online learning", "e-learning"],
  authors: [{ name: "LearnFlow Team" }],
  openGraph: {
    title: "LearnFlow - Smart Teaching & Learning Platform",
    description: "Connect with top educators and accelerate your learning journey",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
