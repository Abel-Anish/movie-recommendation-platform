import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteShell } from "../components/layout/site-shell";
import { ThemeProvider } from "../components/providers/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MovieMatch | Cinematic Storyboard & Mood Discovery",
  description:
    "A world-class cinematic movie discovery platform featuring multi-seed recommendations, Cinema DNA taste profiler, natural-language search, and curated global cinema powered by TMDb.",
  keywords: [
    "movie recommendations",
    "cinema discovery",
    "film taste profiler",
    "world cinema",
    "Cinema DNA",
    "TMDb",
  ],
  openGraph: {
    title: "MovieMatch | Cinematic Storyboard & Mood Discovery",
    description:
      "Find movies tailored to your cinematic DNA, multi-seed inputs, and international taste.",
    type: "website",
    locale: "en_US",
    siteName: "MovieMatch",
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieMatch | Cinematic Storyboard & Mood Discovery",
    description:
      "Find movies tailored to your cinematic DNA, multi-seed inputs, and international taste.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem themes={["light", "dark", "amoled"]}>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
