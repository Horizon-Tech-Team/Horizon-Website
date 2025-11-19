import { Separator } from "@/components/ui/separator";
import { SponsorCard } from "./SponsorCard";

export interface Sponsor {
  name: string;
  booth: string;
  logo: string;
}

interface SponsorListProps {
  category: string;
  sponsors: Sponsor[];
}

export function SponsorList({ category, sponsors }: SponsorListProps) {
  return (
    <section className="my-12">
      {/* Centered Category */}
      <h2 className="text-3xl font-bold mb-10 text-center">{category}</h2>

      {/* Sponsor Grid */}
      <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {sponsors.map((s, idx) => (
          <SponsorCard key={idx} {...s} />
        ))}
      </div>

      {/* Custom Colored Separator (example red) */}
      <Separator className="mt-12 bg-white" />
      <Separator className="mt-4 bg-primary" />
    </section>
  );
}
