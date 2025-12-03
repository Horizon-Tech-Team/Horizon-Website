import React from "react";
import sponsorsData from "@/lib/sponsors";
import { SponsorList } from "./SponsorList";

export default function SponsorsPage() {
  return (
    <main className="max-w-7xl mx-auto container py-10 px-6 md:px-12">
      {/* Page Title */}
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
        Our Sponsors
      </h1>

      {/* Paragraph under heading */}
      <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12 text-lg">
        We’re grateful to our sponsors for their incredible support. Their
        contributions help make this event possible and create opportunities for
        growth, learning, and collaboration.
      </p>

      {/* Sponsor Lists */}
      <div className="space-y-16">
        {Object.entries(sponsorsData).map(([category, arr]) => (
          <SponsorList key={category} category={category} sponsors={arr} />
        ))}
      </div>
    </main>
  );
}