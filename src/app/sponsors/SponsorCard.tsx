import Image from "next/image";

export interface SponsorCardProps {
  logo: string;
  name: string;
  booth?: string;
  size?: "normal" | "large";
}

export function SponsorCard({ logo, name, booth, size = "normal" }: SponsorCardProps) {
  const isLarge = size === "large";

  return (
    <div
      className={`uppercase text-center transition-all duration-300 border border-black
        bg-background text-foreground rounded-2xl
        hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        hover:-translate-y-1
        flex flex-col items-center justify-center
        ${isLarge ? "p-10 w-full max-w-2xl min-h-[400px]" : "p-6 w-full max-w-[350px] min-h-[300px]"}`}
    >
      <div className={`flex items-center justify-center w-full mb-6 ${isLarge ? "h-72" : "h-48"}`}>
        <div className="relative w-full h-full">
          <Image src={logo} alt={name} fill className="object-contain" />
        </div>
      </div>

      <h3 className={`font-bold tracking-tight mb-2 ${isLarge ? "text-2xl" : "text-2xl"}`}>
        {name}
      </h3>

      {booth && (
        <p className="text-lg text-muted-foreground font-medium">
          Booth: {booth}
        </p>
      )}
    </div>
  );
}
