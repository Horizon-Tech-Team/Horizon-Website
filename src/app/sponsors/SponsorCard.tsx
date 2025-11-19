import Image from "next/image";

export interface SponsorCardProps {
  logo: string;
  name: string;
  booth: string;
}

export function SponsorCard({ logo, name, booth }: SponsorCardProps) {
  // export default function SponsorCard({ logo, name, booth }) {
  return (
    <div
      className="uppercase p-4 text-center transition-shadow border border-transparent 
           px-4 py-2 shadow-[5px_5px_0px_0px_#6c6c6c]
           bg-background text-white rounded-2xl
           hover:bg-transparent hover:text-primary
           hover:border-primary
           duration-300 hover:shadow-[5px_5px_0px_0px]"
    >
      <div className="flex items-center justify-center h-20">
        <Image
          src={logo}
          alt={name}
          width={80}
          height={80}
          className="object-contain"
        />
      </div>
      <p className="mt-3 font-semibold">{name}</p>
      <p className="text-sm text-muted-foreground">Booth No: {booth}</p>
      <button className="mt-3 text-blue-600 uppercase text-sm font-medium hover:underline">
        View Profile
      </button>
    </div>
  );
}
