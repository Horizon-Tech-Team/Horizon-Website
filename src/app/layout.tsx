// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/one-time/Navbar";
import Footer from "@/components/one-time/Footer";
import { AuthProvider } from "@/app/AuthProvider";
import { getCurrentUser } from "./actions/actions";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horizon Fest 2025",
  description:
    "Join the leading tech minds and creators at Horizon Fest 2025 — innovate, compete, and connect.",
  icons: {
    icon: [
      { url: "/logo1.png", media: "(prefers-color-scheme: light)" },
      { url: "/logo.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: [
      { url: "/logo1.png", media: "(prefers-color-scheme: light)" },
      { url: "/logo.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
  openGraph: {
    title: "Horizon Fest 2025",
    description:
      "Join the leading tech minds and creators at Horizon Fest 2025 — innovate, compete, and connect.",
    url: "https://www.horizonfest.in/",
    siteName: "Horizon Fest",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://www.horizonfest.in/OG.png",
        width: 1200,
        height: 630,
        alt: "Horizon Fest 2025 Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Horizon Fest 2025",
    description:
      "Join the leading tech minds and creators at Horizon Fest 2025 — innovate, compete, and connect.",
    images: ["https://www.horizonfest.in/OG.png"],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data } = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased px-2 md:px-10`}
      >
        <AuthProvider userFromServer={data}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <div className="min-h-[50vh]">{children}</div>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
