import Banner from "@/components/one-time/Banner";
import Banner2 from "@/components/one-time/Bannner2";
import Hero from "@/components/one-time/Hero";
import Testimonial from "@/components/one-time/Testimonial";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Horizon Tech Fest 2025-26 | The Evolution of Technology",
    template: "%s | Horizon 2025-26", // dynamic pages can prepend their own title
  },
  description:
    "Join the leading tech minds and creators at Horizon Tech Fest 2025 — The Evolution of Technology.",
  openGraph: {
    title: "Horizon Tech Fest 2025-26",
    description:
      "Join the leading tech minds and creators at Horizon Tech Fest 2025 — The Evolution of Technology.",
    url: "https://horizonfest.in",
    siteName: "Horizon Tech Fest 2025-26",
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
    title: "Horizon Tech Fest 2025-26",
    description:
      "Join the leading tech minds and creators at Horizon Tech Fest 2025 — The Evolution of Technology.",
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
