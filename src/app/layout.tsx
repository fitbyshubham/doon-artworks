// src/app/layout.tsx
import type { Metadata } from "next";
import Footer from "@/components/layout/footer"; // Import Footer
import Header from "@/components/layout/header";
import "../styles/globals.css"; // Import Header
// It's highly recommended to have a global CSS file for base styles.
// Make sure you have one and import it here, or create one (e.g., globals.css)
// import './globals.css'; // Uncomment and adjust path if needed

// --- DEFAULT METADATA ---
export const metadata: Metadata = {
  // Use metadata, not meta
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
    url: "https://pop.doonschool.com", // Removed extra spaces
    title: "Palettes of Promise",
    description: "Where Every Stroke Funds a Future",
    siteName: "Palettes of Promise",
    images: [
      {
        url: "https://pop.doonschool.com/images/logo.jpg", // Removed extra spaces
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
      {/* The <head> is handled by Next.js based on the metadata above and any <head> tags in page files */}
      <body>
        {/* Place Header INSIDE the body */}
        <Header />
        {/* Main content goes here */}
        <main>{children}</main>
        {/* Place Footer INSIDE the body, typically after the main content */}
        <Footer />
      </body>
    </html>
  );
}
