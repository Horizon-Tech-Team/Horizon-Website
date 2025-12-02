// src/app/about/page.tsx
import { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import vp from "@/assets/vp.jpg";
import arya from "@/assets/Arya_Tambe.jpeg";
const fallbackArya: string =
  "/mnt/data/555f84d5-9be9-4fcb-a6e3-1741c7f46ab8.png";
import type { StaticImageData } from "next/image";

import {
  Calendar,
  MapPin,
  Users,
  Zap,
  Award,
  Globe,
  Code,
  Lightbulb,
  Cpu,
} from "lucide-react";

/* ------------------ Types ------------------ */
type Person = {
  id?: number;
  name?: string;
  designation?: string;
  slogan?: string;
  image?: string | StaticImageData;
};

type Team = {
  title: string;
  head?: Person | null;
  cohead?: Person | Person[] | null;
  coheads?: Person[] | null;
};

/* ------------------ Data ------------------ */
// trimmed / identical data to what you had (kept same values).
const teamMembers: Person[] = [
  {
    id: 1,
    name: "Vedika Mayekar",
    designation: "President",
    slogan:
      "Guiding Horizon toward growth, learning, and limitless possibilities.",
    image: "https://i.pravatar.cc/300?img=1",
  },
  {
    id: 2,
    name: "Harshad Baraskar",
    designation: "Mass Media Head",
    slogan: "Capturing smiles.",
    image: "https://i.pravatar.cc/300?img=2",
  },
  {
    id: 3,
    name: "Sanika Lad",
    designation: "Marketing Head",
    slogan: "Marketing with purpose, leading the way.",
    image: "https://i.pravatar.cc/300?img=3",
  },
  {
    id: 4,
    name: "Krupa Bhosale",
    designation: "Secretary",
    slogan: "Leading through coordination, learning through experience.",
    image: "https://i.pravatar.cc/300?img=4",
  },
  {
    id: 5,
    name: "Pushkar Patil",
    designation: "Security Co-Head",
    slogan: "Guarding memories with precision.",
    image: "https://i.pravatar.cc/300?img=5",
  },
  {
    id: 6,
    name: "Tanish Chavan",
    designation: "Marketing Co-Head",
    slogan: "Driving growth through marketing.",
    image: "https://i.pravatar.cc/300?img=6",
  },
  {
    id: 8,
    name: "Yash Gupta",
    designation: "Management Co-Head",
    slogan: "Turning challenges into checklists.",
    image: "https://i.pravatar.cc/300?img=8",
  },
  {
    id: 9,
    name: "Om Bhangare",
    designation: "Media Co-Head",
    slogan: "Decoding media, Designing moments.",
    image: "https://i.pravatar.cc/300?img=9",
  },
  {
    id: 10,
    name: "Madhura Kadam",
    designation: "PR Head",
    slogan: "Bridging minds, shaping moments.",
    image: "https://i.pravatar.cc/300?img=10",
  },
  {
    id: 12,
    name: "Nitish Dole",
    designation: "Creative Co-Head",
    slogan: "Imagine, create, inspire.",
    image: "https://i.pravatar.cc/300?img=12",
  },
  {
    id: 13,
    name: "Sanchi Surve",
    designation: "Creative Head",
    slogan: "Leading with vision, creating with passion.",
    image: "https://i.pravatar.cc/300?img=13",
  },
  {
    id: 14,
    name: "Atharv Chavan",
    designation: "Security Head",
    slogan: "Good vibes, Great welcomes!",
    image: "https://i.pravatar.cc/300?img=14",
  },
  {
    id: 15,
    name: "Arpita Chavan",
    designation: "Security Co-Head",
    slogan: "Where security meets responsibility..",
    image: "https://i.pravatar.cc/300?img=15",
  },
  {
    id: 16,
    name: "Arya Tambe",
    designation: "Technical Head",
    slogan: "Beyond error lies evolution.",
    image: arya,
  },
  {
    id: 17,
    name: "Shubham Bandarkar",
    designation: "Vice President 1",
    slogan: "Battlefield of Ideas, Victory of Innovation.",
    image: vp,
  },
  {
    id: 18,
    name: "Soham Patil",
    designation: "Management Head",
    slogan: "Leading with logic, managing with heart.",
    image: vp,
  },
  {
    id: 19,
    name: "Parth Lahor",
    designation: "Vice President 2",
    slogan: "One Team. One Mission. One Fest.",
    image: "https://i.pravatar.cc/300?img=19",
  },
];

const teams: Team[] = [
  {
    title: "Technical Team",
    head: teamMembers.find((m) => m.designation === "Technical Head") || null,
  },
  {
    title: "Creative Team",
    head: teamMembers.find((m) => m.designation === "Creative Head") || null,
    cohead:
      teamMembers.find((m) => m.designation === "Creative Co-Head") || null,
  },
  {
    title: "Management Team",
    head: teamMembers.find((m) => m.designation === "Management Head") || null,
    cohead:
      teamMembers.find((m) => m.designation === "Management Co-Head") || null,
  },
  {
    title: "Marketing Team",
    head: teamMembers.find((m) => m.designation === "Marketing Head") || null,
    cohead:
      teamMembers.find((m) => m.designation === "Marketing Co-Head") || null,
  },
  {
    title: "Security Team",
    head: teamMembers.find((m) => m.designation === "Security Head") || null,
    cohead:
      teamMembers.find((m) => m.designation === "Security Co-Head") || null,
  },
  {
    title: "Mass Media Team",
    head: teamMembers.find((m) => m.designation === "Mass Media Head") || null,
    cohead: teamMembers.find((m) => m.designation === "Media Co-Head") || null,
  },
  {
    title: "PR Team",
    head: teamMembers.find((m) => m.designation === "PR Head") || null,
  },
];

export const metadata: Metadata = {
  title: "About Horizon Tech Fest 2025",
  description:
    "Learn more about Horizon Tech Fest 2025 — its mission, vision, and the team behind the scenes.",
};

export default function AboutPage() {
  const president =
    teamMembers.find((m) => m.designation === "President") || null;
  const vps = [
    teamMembers.find((m) => m.designation === "Vice President 1") || null,
    teamMembers.find((m) => m.designation === "Vice President 2") || null,
  ].filter(Boolean) as Person[];
  const secretary =
    teamMembers.find((m) => m.designation === "Secretary") || null;

  return (
    <div className="container max-w-7xl py-8 mx-auto px-4 md:px-6">
      {/* Hero */}
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-12">
        <video
          src="/Looping-vid.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full opacity-90 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex flex-col justify-center p-6">
          <Badge className="mb-2 w-fit" variant="secondary">
            May 15-18, 2025
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Horizon Tech Fest 2025
          </h1>
          <p className="text-lg md:text-2xl text-white/90 max-w-2xl">
            Hello Tech World 2025: Exploring the Frontiers of Innovation
          </p>
        </div>
      </div>

      {/* --- About + Stats --- */}
      <div className="mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
          About Horizon Tech Fest
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <p className="text-base md:text-lg mb-4">
              Horizon Fest is an annual tech event by the CS-IT Department of
              Kirti M. Doongursee College, established in 2000. Inspired by the
              motto{" "}
              <span className="font-semibold">
                &ldquo;Unity is Strength&rdquo;
              </span>
              , it unites students through technology with events like Conexa, a
              networking platform, and coding competitions. Horizon Fest fosters
              creativity, innovation, and collaboration, making it a must-attend
              for tech enthusiasts.
            </p>
            <p className="text-base md:text-lg mb-4">
              Our 2025 theme, &quot;Hello Tech World,&quot; invites participants
              to explore the frontiers of innovation and reimagine the future of
              technology. From artificial intelligence and blockchain to quantum
              computing and sustainable tech, Horizon Tech Fest 2025 will be a
              celebration of human ingenuity and technological advancement.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Button asChild>
                <Link href="/events">Explore Events</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
                <Calendar className="h-8 w-8 md:h-10 md:w-10 mb-3 md:mb-4 text-primary" />
                <h3 className="font-bold mb-1">4 Days</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Of Tech Innovation
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
                <MapPin className="h-8 w-8 md:h-10 md:w-10 mb-3 md:mb-4 text-primary" />
                <h3 className="font-bold mb-1">5 Venues</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Across the City
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
                <Users className="h-8 w-8 md:h-10 md:w-10 mb-3 md:mb-4 text-primary" />
                <h3 className="font-bold mb-1">10,000+</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Expected Attendees
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
                <Zap className="h-8 w-8 md:h-10 md:w-10 mb-3 md:mb-4 text-primary" />
                <h3 className="font-bold mb-1">50+</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Tech Events
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* --- Theme / Highlights / Events --- */}
      <div className="mb-12 md:mb-16 bg-muted/30 p-4 sm:p-6 md:p-8 rounded-xl">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            2025 Theme
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
            Hello Tech World 2025
          </h2>
          <p className="text-base md:text-lg mb-6">
            Our theme for 2025 celebrates the convergence of technology and
            human creativity. &quot;Hello Tech World&quot; is more than just a
            greeting—it&apos;s an invitation to explore, innovate, and shape the
            future of technology together.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
            <div className="flex flex-col items-center">
              <Globe className="h-10 w-10 md:h-12 md:w-12 text-primary mb-3 md:mb-4" />
              <h3 className="font-bold mb-1 md:mb-2">Global Connection</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Bringing together tech communities from around the world
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Code className="h-10 w-10 md:h-12 md:w-12 text-primary mb-3 md:mb-4" />
              <h3 className="font-bold mb-1 md:mb-2">Innovation</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Showcasing breakthrough technologies and ideas
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Lightbulb className="h-10 w-10 md:h-12 md:w-12 text-primary mb-3 md:mb-4" />
              <h3 className="font-bold mb-1 md:mb-2">Inspiration</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Sparking creativity and new possibilities
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
          Event Highlights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
              <Award className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-2">
                TECH-SPOTLIGHT
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Explore cutting-edge innovations and showcase your tech
                brilliance.
              </p>
              <Badge variant="outline">Competition</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
              <Cpu className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-2">
                TECHNICAL EVENTS
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Put your engineering and problem-solving skills to the test.
              </p>
              <Badge variant="outline">Conference</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
              <Globe className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-2">
                ANALYTICAL EVENTS
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Decode puzzles and data-driven challenges with sharp logic.
              </p>
              <Badge variant="outline">Exhibition</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
              <Users className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-2">
                VERBAL EVENTS
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Express, debate, and articulate your ideas with confidence.
              </p>
              <Badge variant="outline">Networking</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
              <Lightbulb className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-2">
                CREATIVE EVENTS
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Let imagination run wild through art, design, and storytelling.
              </p>
              <Badge variant="outline">Competition</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
              <Code className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-2">FUN EVENTS</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Unwind and enjoy light-hearted competitions that bring out your
                playful side!
              </p>
              <Badge variant="outline">Learning</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- Meet Our Team (typed components) --- */}
      <section className="mb-24 px-4 md:px-12" aria-labelledby="team-heading">
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <h2
            id="team-heading"
            className="text-3xl md:text-4xl font-bold text-white mb-2"
          >
            Meet Our Team
          </h2>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            Horizon Tech Fest is organized by a dedicated team of technology
            enthusiasts and professionals.
          </p>
        </div>

        {(() => {
          /* TopTile */
          const TopTile: React.FC<{
            person?: Person | null;
            label?: string;
          }> = ({ person, label }) => {
            if (!person) return null;

            // imgSrc will be either string or StaticImageData — both valid for next/image
            const imgSrc =
              person.image ??
              (person.name === "Arya Tambe"
                ? fallbackArya
                : "/placeholder.svg");
            const altText = person.name ?? label ?? "";

            return (
              <div className="mx-auto max-w-xl w-full">
                <div className="flex flex-col items-center text-center p-6">
                  <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-lg overflow-hidden border-2 border-gray-800">
                    <Image
                      src={imgSrc}
                      alt={altText}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-4 text-xl font-semibold text-white">
                    {person.name}
                  </p>
                  <p className="text-sm text-indigo-200 mt-1 uppercase">
                    {label}
                  </p>
                  {person.slogan ? (
                    <p className="text-gray-300 text-sm mt-2 max-w-xl">
                      {person.slogan}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          };

          /* SmallMember */
          const SmallMember: React.FC<{
            person?: Person | null;
            roleLabel?: string;
          }> = ({ person, roleLabel }) => {
            if (!person) return null;

            const imgSrc =
              person.image ??
              (person.name === "Arya Tambe"
                ? fallbackArya
                : "/placeholder.svg");
            const altText = person.name ?? roleLabel ?? "";

            return (
              <div className="flex flex-col items-center text-center w-44 sm:w-48">
                <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-lg overflow-hidden border-2 border-gray-800 mx-auto">
                  <Image
                    src={imgSrc}
                    alt={altText}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 text-sm font-semibold text-white leading-tight">
                  {roleLabel || person.designation}
                </p>
                <p className="text-xs text-indigo-200 mt-1">{person.name}</p>
                {person.slogan ? (
                  <p className="text-gray-300 text-xs mt-2 max-w-[10rem]">
                    {person.slogan}
                  </p>
                ) : null}
              </div>
            );
          };

          /* helpers */
          const normalizeCoheads = (team: Team | undefined): Person[] => {
            if (!team) return [];
            if (Array.isArray(team.coheads))
              return team.coheads.filter(Boolean) as Person[];
            if (team.cohead) {
              return Array.isArray(team.cohead)
                ? (team.cohead.filter(Boolean) as Person[])
                : ([team.cohead].filter(Boolean) as Person[]);
            }
            return [];
          };

          const members: Person[] = teamMembers;
          const find = (designation: string): Person | null =>
            members.find((m) => m.designation === designation) || null;

          const teamsSource: Team[] =
            Array.isArray(teams) && teams.length
              ? teams.map((t) => ({ ...t, coheads: normalizeCoheads(t) }))
              : [
                  { title: "Technical Team", head: find("Technical Head") },
                  {
                    title: "Mass Media Team",
                    head: find("Mass Media Head"),
                    coheads: [find("Media Co-Head")].filter(
                      Boolean
                    ) as Person[],
                  },
                  {
                    title: "Marketing Team",
                    head: find("Marketing Head"),
                    coheads: [find("Marketing Co-Head")].filter(
                      Boolean
                    ) as Person[],
                  },
                  {
                    title: "Management Team",
                    head: find("Management Head"),
                    coheads: [find("Management Co-Head")].filter(
                      Boolean
                    ) as Person[],
                  },
                  {
                    title: "Creative Team",
                    head: find("Creative Head"),
                    coheads: [find("Creative Co-Head")].filter(
                      Boolean
                    ) as Person[],
                  },
                  {
                    title: "Security Team",
                    head: find("Security Head"),
                    coheads: [find("Security Co-Head")].filter(
                      Boolean
                    ) as Person[],
                  },
                  { title: "PR Team", head: find("PR Head"), coheads: [] },
                ];

          // ensure Security includes Arpita & Pushkar
          const sec = teamsSource.find((t) =>
            t.title?.toLowerCase().includes("security")
          );
          if (sec) {
            const pushkar = members.find((m) => m.name === "Pushkar Patil");
            const arpita = members.find((m) => m.name === "Arpita Chavan");
            const map = new Map(
              (sec.coheads || []).map((c) => [c.name ?? c.id, c])
            );
            if (pushkar) map.set(pushkar.name ?? `p-${pushkar.id}`, pushkar);
            if (arpita) map.set(arpita.name ?? `a-${arpita.id}`, arpita);
            sec.coheads = Array.from(map.values());
          }

          const desiredOrder = [
            "Technical Team",
            "Mass Media Team",
            "Marketing Team",
            "Management Team",
            "Creative Team",
            "Security Team",
            "PR Team",
          ];

          const orderedTeams = desiredOrder
            .map((t) =>
              teamsSource.find(
                (x) => x.title?.toLowerCase() === t.toLowerCase()
              )
            )
            .filter(Boolean) as Team[];

          const presidentVar: Person | null = president;
          const secretaryVar: Person | null = secretary;
          const vpsVar: Person[] = vps;

          return (
            <>
              {/* President */}
              <div className="mb-8">
                <TopTile person={presidentVar} label="President" />
              </div>

              {/* Secretary */}
              <div className="mb-8">
                <TopTile person={secretaryVar} label="Secretary" />
              </div>

              {/* VPs */}
              <div className="mb-10 flex flex-wrap justify-center gap-8">
                {vpsVar.map((vp, idx) => (
                  <div
                    key={vp.id ?? idx}
                    className="transform transition-transform duration-150 hover:scale-105 w-full sm:w-auto flex justify-center"
                  >
                    <TopTile person={vp} label="Vice President" />
                  </div>
                ))}
              </div>

              {/* Teams */}
              <div className="space-y-10">
                {orderedTeams.map((team) => {
                  const head = team.head || null;
                  const coheads = team.coheads || [];
                  const membersArr = [head, ...coheads].filter(
                    Boolean
                  ) as Person[];

                  return (
                    <div key={team.title} className="w-full">
                      <div className="max-w-6xl mx-auto flex flex-col items-center">
                        <h3 className="text-2xl font-bold text-white mb-6">
                          {team.title}
                        </h3>
                        <div className="flex flex-wrap justify-center gap-8">
                          {membersArr.map((m) => (
                            <div
                              key={m.id ?? m.name}
                              className="transform transition-transform duration-150 hover:scale-105"
                            >
                              <SmallMember
                                person={m}
                                roleLabel={m.designation}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}
      </section>
    </div>
  );
}
