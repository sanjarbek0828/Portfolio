import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { SmoothScroll } from "@/components/SmoothScroll";


import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sanjarme.uz"),
  title: {
    default: "Sanjarbek Otabekov — Full-Stack Developer & UI/UX Designer",
    template: "%s — Sanjarbek Otabekov",
  },
  description:
    "Sanjarbek Otabekov — zamonaviy, tezkor va yuqori unumdorlikka ega web ilovalar yaratadigan Full-Stack Developer va UI/UX Designer.",
  keywords: [
    "Sanjarbek Otabekov",
    "Full-Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Node.js Developer",
    "UI/UX Designer",
    "O‘zbekiston dasturchi",
  ],
  authors: [{ name: "Sanjarbek Otabekov", url: "https://sanjarme.uz" }],
  creator: "Sanjarbek Otabekov",
  openGraph: {
    title: "Sanjarbek Otabekov — Full-Stack Developer & UI/UX Designer",
    description:
      "Zamonaviy, tezkor va foydalanuvchiga yo‘naltirilgan web ilovalar, botlar va interfeyslar yarataman.",
    url: "https://sanjarme.uz/",
    siteName: "Sanjarbek Otabekov Portfolio",
    images: [
      {
        url: "https://sanjarme.uz/preview.jpg",
        width: 1200,
        height: 630,
        alt: "Sanjarbek Otabekov Portfolio Preview",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanjarbek Otabekov — Full-Stack Developer & UI/UX Designer",
    description:
      "Zamonaviy, tezkor va foydalanuvchiga yo‘naltirilgan web ilovalar, botlar va interfeyslar yarataman.",
    images: ["https://sanjarme.uz/preview.jpg"],
    creator: "@sanjarbek_404",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://sanjarme.uz",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020611" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sanjarbek Otabekov",
    jobTitle: "Full-Stack Developer & UI/UX Designer",
    url: "https://sanjarme.uz",
    sameAs: [
      "https://github.com/sanjarbek404",
      "https://www.linkedin.com/in/sanjarbek-otabekov-0600733bb/",
      "https://t.me/sanjarbek_404"
    ],
    description: "Sanjarbek Otabekov — zamonaviy, tezkor va yuqori unumdorlikka ega web ilovalar yaratadigan Full-Stack Developer va UI/UX Designer.",
    image: "https://sanjarme.uz/preview.jpg"
  };

  return (
    <html lang="uz" suppressHydrationWarning>
      <body className="bg-background font-sans text-foreground antialiased selection:bg-primary/30 selection:text-primary" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <SmoothScroll>
                <AnalyticsTracker />
                <a
                  href="#main-content"
                  className="focus-ring fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition focus:translate-y-0"
                >
                  Kontentga o‘tish
                </a>
                {children}
              </SmoothScroll>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
