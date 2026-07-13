import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sanjarme.uz"),
  title: {
    default: "Sanjarbek Otabekov — Full-Stack Developer & UI/UX Designer | Portfolio",
    template: "%s — Sanjarbek Otabekov",
  },
  description:
    "Sanjarbek Otabekov — React, Next.js, Node.js va TypeScript texnologiyalari bilan zamonaviy, tezkor va yuqori unumdorlikka ega web ilovalar yaratadigan Full-Stack Developer va UI/UX Designer. O'zbekistonlik professional dasturchi.",
  keywords: [
    "Sanjarbek Otabekov",
    "Full-Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Node.js Developer",
    "TypeScript Developer",
    "UI/UX Designer",
    "Web Developer Uzbekistan",
    "O'zbekistonlik dasturchi",
    " dasturchi",
    "Frontend Developer",
    "Backend Developer",
    "Portfolio",
    "Freelance Developer",
    "JavaScript Developer",
  ],
  authors: [{ name: "Sanjarbek Otabekov", url: "https://sanjarme.uz" }],
  creator: "Sanjarbek Otabekov",
  publisher: "Sanjarbek Otabekov",
  category: "technology",
  openGraph: {
    title: "Sanjarbek Otabekov — Full-Stack Developer & UI/UX Designer",
    description:
      "React, Next.js, Node.js bilan zamonaviy web ilovalar, Telegram botlar va chiroyli interfeyslar yarataman. 7+ real loyiha, 3+ xursand mijoz.",
    url: "https://sanjarme.uz/",
    siteName: "Sanjarbek Otabekov Portfolio",
    images: [
      {
        url: "/Preview.png",
        width: 1200,
        height: 630,
        alt: "Sanjarbek Otabekov — Full-Stack Developer & UI/UX Designer Portfolio",
        type: "image/png",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanjarbek Otabekov — Full-Stack Developer & UI/UX Designer",
    description:
      "React, Next.js, Node.js bilan zamonaviy web ilovalar, Telegram botlar va chiroyli interfeyslar yarataman.",
    images: [
      {
        url: "/Preview.png",
        width: 1200,
        height: 630,
        alt: "Sanjarbek Otabekov Portfolio Preview",
      },
    ],
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
  other: {
    "google-site-verification": "",
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
    alternateName: "Sanjarbek",
    jobTitle: "Full-Stack Developer & UI/UX Designer",
    url: "https://sanjarme.uz",
    sameAs: [
      "https://github.com/sanjarbek404",
      "https://www.linkedin.com/in/sanjarbek-otabekov-0600733bb/",
      "https://t.me/sanjarbek_404",
    ],
    description: "Sanjarbek Otabekov — React, Next.js, Node.js va TypeScript texnologiyalari bilan zamonaviy web ilovalar yaratadigan Full-Stack Developer va UI/UX Designer.",
    image: "https://sanjarme.uz/Preview.png",
    email: "sanjarbekotabekov010@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toshkent",
      addressCountry: "UZ",
    },
    knowsAbout: ["React", "Next.js", "Node.js", "TypeScript", "Tailwind CSS", "UI/UX Design", "JavaScript", "MongoDB", "Firebase"],
    knowsLanguage: ["uz", "ru", "en"],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sanjarbek Otabekov Portfolio",
    url: "https://sanjarme.uz",
    description: "Professional portfolio of Sanjarbek Otabekov — Full-Stack Developer & UI/UX Designer",
    author: {
      "@type": "Person",
      name: "Sanjarbek Otabekov",
    },
  };

  return (
    <html lang="uz" suppressHydrationWarning>
      <body className="bg-background font-sans text-foreground antialiased selection:bg-primary/30 selection:text-primary" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <LanguageProvider>
            <ThemeProvider>
              <AnalyticsTracker />
              <a
                href="#main-content"
                className="focus-ring fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition focus:translate-y-0"
              >
                Kontentga o‘tish
              </a>
              {children}
            </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
