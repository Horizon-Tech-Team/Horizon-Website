import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/one-time/Navbar";
import Footer from "@/components/one-time/Footer";
import { AuthProvider } from "@/app/AuthProvider";
import { getCurrentUser } from "./actions/actions";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

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
