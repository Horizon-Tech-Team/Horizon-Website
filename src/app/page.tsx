import Banner from "@/components/one-time/Banner";
import Banner2 from "@/components/one-time/Bannner2";
import Hero from "@/components/one-time/Hero";
import Testimonial from "@/components/one-time/Testimonial";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Horizon Tect Fest 2025 | Innovate Beyond Limits",
    template: "%s | Horizon 2025", // dynamic pages can prepend their own title
  },
  description:
    "Join the leading tech minds and creators at Horizon Tect Fest 2025 — where innovation meets inspiration.",
  openGraph: {
    title: "Horizon Tect Fest 2025",
    description:
      "Join the leading tech minds and creators at Horizon Tect Fest 2025 — where innovation meets inspiration.",
    url: "https://horizon-frontend-vert.vercel.app",
    siteName: "Horizon Tect Fest 2025",
    images: [
      {
        url: "https://gjewacuwtvvhxoazxrco.supabase.co/storage/v1/object/public/events/horizon_og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Horizon Tect Fest 2025",
    description:
      "Join the leading tech minds and creators at Horizon Tect Fest 2025 — where innovation meets inspiration.",
    images: [
      "https://gjewacuwtvvhxoazxrco.supabase.co/storage/v1/object/public/events/horizon_og.png",
    ],
  },
};

export default async function Home() {
  return (
    <main className="flex flex-col overflow-hidden justify-center items-center overflow-x-hidden">
      <Hero />
      {/* <Brands /> */}
      {/* <Services /> */}
      <Banner />
      <Banner2 />
      <Testimonial />
      {/* <Newsletter />   */}
    </main>
  );
}
