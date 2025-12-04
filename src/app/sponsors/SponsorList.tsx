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
  const isTitleSponsor = category.toLowerCase().includes("title");

  return (
    <section className="my-12">
      {/* Centered Category */}
      <h2 className="text-4xl font-bold mb-10 text-center">{category}</h2>

      {/* Sponsor Grid - Centered Flexbox */}
      <div className="flex flex-wrap justify-center gap-12">
        {sponsors.map((s, idx) => (
          <SponsorCard
            key={idx}
            {...s}
            size={isTitleSponsor ? "large" : "normal"}
          />
        ))}
      </div>
    </section>
  );
}