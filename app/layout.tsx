// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GoogleTranslate from "next-google-translate-widget";
import Script from "next/script";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/DarkFilterController";
import { NotificationProvider } from "@/context/NotificationContext";
import { Toaster } from "@/components/ui/toaster";
import Background from "@/components/animations/Background";

// local Switzer font
const switzer = localFont({
  src: [
    {
      path: "../public/fonts/WEB/fonts/Switzer-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-switzer",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gotenderly.com"),

  title: {
    default: "GoTenderly, Qatar Tender Marketplace",
    template: "%s | GoTenderly",
  },

  description:
    "GoTenderly is Qatar's modern tendering marketplace, submit tenders, discover opportunities, and manage procurement with a clean, fast platform.",

  keywords: [
    "Qatar tenders",
    "tender marketplace",
    "procurement Qatar",
    "RFP Qatar",
    "GoTenderly",
    "bidding platform Qatar",
  ],

  openGraph: {
    title: "GoTenderly, Qatar Tender Marketplace",
    description:
      "Submit tenders, discover opportunities, and manage procurement in one modern platform.",
    url: "https://gotenderly.com",
    siteName: "GoTenderly",
    images: [
      {
        url: "/media/logo.png",
        width: 1200,
        height: 630,
        alt: "GoTenderly Tender Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "GoTenderly, Qatar Tender Marketplace",
    description:
      "Submit tenders, discover opportunities, and manage procurement in one modern platform.",
    images: ["/media/logo.png"],
  },

  icons: {
    icon: "/media/favicon.png",
    shortcut: "/media/favicon.png",
    apple: "/media/favicon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={switzer.variable}>
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <Toaster />
              <LanguageProvider>{children}</LanguageProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
