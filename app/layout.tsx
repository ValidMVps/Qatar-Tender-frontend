// app/layout.tsx
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/DarkFilterController";
import { NotificationProvider } from "@/context/NotificationContext";
import { Toaster } from "@/components/ui/toaster";

/* -------------------------------------------------
   LOCAL FONT – Switzer
   ------------------------------------------------- */
const switzer = localFont({
  src: [
    {
      path: "../public/fonts/WEB/fonts/Switzer-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/WEB/fonts/Switzer-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/WEB/fonts/Switzer-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-switzer",
  display: "swap",
});

/* -------------------------------------------------
   VIEWPORT & METADATA
   ------------------------------------------------- */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://gotenderly.com"),
  title: {
    default: "GoTenderly → Qatar's #1 Tender & Procurement Marketplace",
    template: "%s | GoTenderly, Qatar Tenders",
  },
  description:
    "Qatar’s fastest-growing tender marketplace. Find government & private tenders, submit bids, track opportunities, and win more contracts in Doha and across Qatar.",
  keywords: [
    "Qatar tenders",
    "tenders Qatar",
    "government tenders Qatar",
    "procurement Qatar",
    "RFP Qatar",
    "bidding platform Qatar",
    "tender portal Qatar",
    "construction tenders Qatar",
    "Ashghal tenders",
    "Qatar tender marketplace",
    "anonymous tender Qatar",
    "free tender posting Qatar",
  ],
  authors: [{ name: "GoTenderly Team", url: "https://gotenderly.com" }],
  creator: "GoTenderly",
  publisher: "GoTenderly",

  // ---------- ICONS ----------
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", type: "image/svg+xml", url: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
    ],
  },

  // ---------- OPEN GRAPH ----------
  openGraph: {
    title: "GoTenderly → Qatar's #1 Tender Marketplace",
    description:
      "Submit tenders, discover new opportunities, and manage procurement seamlessly in Qatar.",
    url: "https://gotenderly.com",
    siteName: "GoTenderly",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GoTenderly – Qatar Tender Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // ---------- TWITTER ----------
  twitter: {
    card: "summary_large_image",
    title: "GoTenderly → Qatar's #1 Tender Marketplace",
    description: "The modern way to find and win tenders in Qatar.",
    images: ["/og-image.jpg"],
    creator: "@GoTenderly",
    site: "@GoTenderly",
  },

  // ---------- ROBOTS ----------
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

  // ---------- VERIFICATION ----------
  verification: {
    google: "YOUR_GOOGLE_SITE_VERIFICATION_CODE",
  },

  // ---------- MULTILINGUAL ----------
  alternates: {
    canonical: "https://gotenderly.com",
    languages: {
      "en-US": "https://gotenderly.com",
      "ar-QA": "https://gotenderly.com/ar",
      "x-default": "https://gotenderly.com",
    },
  },
};

/* -------------------------------------------------
   ROOT LAYOUT
   ------------------------------------------------- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${switzer.variable} scroll-smooth`}>
      <head>
        {/* ---------- FONT PRELOAD ---------- */}
        {[
          "Switzer-Regular",
          "Switzer-Medium",
          "Switzer-Semibold",
        ].map((name) => (
          <link
            key={name}
            rel="preload"
            href={`/fonts/WEB/fonts/${name}.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}

        {/* ---------- HREFLANG (only once) ---------- */}
        <link rel="alternate" hrefLang="en" href="https://gotenderly.com" />
        <link rel="alternate" hrefLang="ar" href="https://gotenderly.com/ar" />
        <link rel="alternate" hrefLang="x-default" href="https://gotenderly.com" />

        {/* ---------- STRUCTURED DATA: Organization ---------- */}
        <Script
          id="org-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://gotenderly.com/#organization",
              name: "GoTenderly",
              url: "https://gotenderly.com",
              logo: "https://gotenderly.com/media/logo.png",
              description: "Qatar's leading anonymous tender and bidding platform.",
              sameAs: [
                "https://twitter.com/GoTenderly",
                "https://linkedin.com/company/gotenderly",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "support@gotenderly.com",
                contactType: "Customer Support",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://gotenderly.com/tenders?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* ---------- STRUCTURED DATA: FAQ ---------- */}
        <Script
          id="faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Is GoTenderly free to use?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Posting tenders is free. Bidders pay 100 QAR per bid.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is it really anonymous?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Identities are hidden until you award the tender.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Who can bid on GoTenderly?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Only registered and verified companies can submit bids.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What categories are allowed?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "All categories: construction, IT, logistics, events, healthcare, and more.",
                  },
                },
              ],
            }),
          }}
        />

        {/* ---------- GOOGLE ANALYTICS ---------- */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="ga-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', { 
              page_path: window.location.pathname,
              send_page_view: true
            });
          `}
        </Script>

        {/* ---------- OPTIONAL: TweakCN live preview ---------- */}
        {/* <Script
          id="tweakcn"
          strategy="afterInteractive"
          src="https://tweakcn.com/live-preview.min.js"
        /> */}
      </head>

      <body className="antialiased gh">
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <Toaster />
              <LanguageProvider>
                <main>{children}</main>
              </LanguageProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}