import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/DarkFilterController";
import { NotificationProvider } from "@/context/NotificationContext";
import { Toaster } from "@/components/ui/toaster";

// Local Switzer font
const switzer = localFont({
  src: [
    {
      path: "../public/fonts/WEB/fonts/Switzer-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    // Add more weights if you have them
  ],
  variable: "--font-switzer",
  display: "swap",
});

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
  ],
  authors: [{ name: "GoTenderly Team", url: "https://gotenderly.com" }],
  creator: "GoTenderly",
  publisher: "GoTenderly",

  // === FAVICONS (FIXED – this is the correct way in App Router) ===
  icons: {
    icon: ["/favicon.svg"], // ← 404-proof default
    shortcut: ["/favicon.svg"],
    apple: ["/favicon.svg"], // put apple-touch-icon.png in /public
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon.svg",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon.svg",
      },
    ],
  },

  // === OPEN GRAPH / FACEBOOK ===
  openGraph: {
    title: "GoTenderly → Qatar's #1 Tender Marketplace",
    description:
      "Submit tenders, discover new opportunities, and manage procurement seamlessly in Qatar.",
    url: "https://gotenderly.com",
    siteName: "GoTenderly",
    images: [
      {
        url: "/og-image.jpg", // 1200×630 recommended – put in /public
        width: 1200,
        height: 630,
        alt: "GoTenderly, Qatar Tender Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // === TWITTER / X ===
  twitter: {
    card: "summary_large_image",
    title: "GoTenderly → Qatar's #1 Tender Marketplace",
    description: "The modern way to find and win tenders in Qatar.",
    images: ["/og-image.jpg"],
    creator: "@GoTenderly",
    site: "@GoTenderly",
  },

  // === ROBOTS & VERIFICATION ===
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
  verification: {
    google: "YOUR_GOOGLE_SITE_VERIFICATION_CODE",
  },

  alternates: {
    canonical: "https://gotenderly.com",
    languages: {
      "en-US": "https://gotenderly.com",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={switzer.variable}>
      <head>
        <link
          rel="preload"
          href="/fonts/WEB/fonts/Switzer-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "GoTenderly",
              url: "https://gotenderly.com",
              logo: "https://gotenderly.com/media/logo.png",
              sameAs: [
                "https://twitter.com/GoTenderly",
                "https://linkedin.com/company/gotenderly",
              ],
              "@id": "https://gotenderly.com/#organization",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://gotenderly.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Google Analytics – replace G-XXXXXXXXXX */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', { 
              page_path: window.location.pathname + window.location.search 
            });
          `}
        </Script>

        {/* TweakCN live preview */}
        <Script
          id="tweakcn-live-preview"
          strategy="afterInteractive"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head>

      <body className="antialiased">
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
