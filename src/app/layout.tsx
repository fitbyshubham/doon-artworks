// src/app/layout.tsx
import type { Metadata } from "next";

// --- DEFAULT METADATA ---
// Twitter section REMOVED
export const meta: Metadata = {
  title: {
    default: "Palettes of Promise",
    template: "%s | Palettes of Promise",
  },
  description: "Where Every Stroke Funds a Future",
  keywords: ["art", "auction", "pledge", "support artists", "doon school"],
  authors: [{ name: "Palettes of Promise Team" }],
  creator: "Palettes of Promise",
  publisher: "The Doon School",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // --- OPEN GRAPH DEFAULTS ---
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pop.doonschool.com",
    title: "Palettes of Promise",
    description: "Where Every Stroke Funds a Future",
    siteName: "Palettes of Promise",
    images: [
      {
        url: "https://pop.doonschool.com/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Palettes of Promise Logo",
      },
    ],
  },
  // --- FAVICON ---
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    // apple: "/apple-touch-icon.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#004276",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
