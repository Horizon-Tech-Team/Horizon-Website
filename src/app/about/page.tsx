import { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import vp from "@/assets/vp.jpg";
import arya from "@/assets/Arya_Tambe.jpeg";

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

// Team member data
const teamMembers = [
  {
    id: 1,
    name: "Vedika Mayekar",
    designation: "President",
    slogan: "Guiding Horizon toward growth, learning, and limitless possibilities.",
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
    designation: "Photographer",
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
    id: 7,
    name: "Omkar Kokate",
    designation: "Security Head",
    slogan: "Be bold, be safe, be sentinel.",
    image: "https://i.pravatar.cc/300?img=7",
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
    name: "Yash Khilare",
    designation: "PR Head",
    slogan: "Influence through words, impact through action.",
    image: "https://i.pravatar.cc/300?img=10",
  },
  // {
  //   id: 11,
  //   name: "Dhiraj Lande",
  //   designation: "Technical Head",
  //   slogan: "Logic is my compass, code is my language...",
  //   image: "https://i.pravatar.cc/300?img=11",
  // },
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
    designation: "Hospitality Head",
    slogan: "Good vibes, Great welcomes!",
    image: "https://i.pravatar.cc/300?img=14",
  },
  {
    id: 15,
    name: "Arpita Chavan",
    designation: "Hospitality Co-Head",
    slogan: "The warmth behind the welcome.",
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
    name: "Shubham Bandarkar & Parth Lahor",
    designation: "Vice President 1",
    slogan: "One Team. One Mission. One Fest.",
    image: vp,
  },
  {
    id: 18,
    name: "Soham Patil",
    designation: "Management Head",
    slogan: "Leading with logic, managing with heart.",
    image: vp,
  },
  // {
  //   id: 19,
  //   name: "Parth Lahor",
  //   designation: "Vice President 2",
  //   slogan: "Battlefield of ideas, victory of innovation. One Team. One Mission. One Fest.",
  //   image: "https://i.pravatar.cc/300?img=19",
  // },
];

const teams = [
  {
    title: "Technical Team",
    head: teamMembers.find((m) => m.designation === "Technical Head"),
    cohead: teamMembers.find((m) => m.designation === "Technical Co-Head"),
  },
  {
    title: "Creative Team",
    head: teamMembers.find((m) => m.designation === "Creative Head"),
    cohead: teamMembers.find((m) => m.designation === "Creative Co-Head"),
  },
  {
    title: "Management Team",
    head: teamMembers.find((m) => m.designation === "Management Head"),
    cohead: teamMembers.find((m) => m.designation === "Management Co-Head"),
  },
  {
    title: "Marketing Team",
    head: teamMembers.find((m) => m.designation === "Marketing Head"),
    cohead: teamMembers.find((m) => m.designation === "Marketing Co-Head"),
  },
  {
    title: "Hospitality Team",
    head: teamMembers.find((m) => m.designation === "Hospitality Head"),
    cohead: teamMembers.find((m) => m.designation === "Hospitality Co-Head"),
  },
  {
    title: "Mass Media Team",
    head: teamMembers.find((m) => m.designation === "Mass Media Head"),
    cohead: teamMembers.find((m) => m.designation === "Media Co-Head"),
  },
  {
    title: "PR Team",
    head: teamMembers.find((m) => m.designation === "PR Head"),
  },
];

export const metadata: Metadata = {
  title: "About Horizon Tech Fest 2025",
  description:
    "Learn more about Horizon Tech Fest 2025 — its mission, vision, and the team behind the scenes.",
};

export default function AboutPage() {
  const president = teamMembers.find((m) => m.designation === "President");
  const vps = [
    teamMembers.find((m) => m.designation === "Vice President 1"),
    teamMembers.find((m) => m.designation === "Vice President 2"),
  ].filter(Boolean) as {
    id: number;
    name: string;
    designation: string;
    slogan: string;
    image: string;
  }[];
  const secretary = teamMembers.find((m) => m.designation === "Secretary");

  return (
    <div className="container max-w-7xl py-8 mx-auto px-4 md:px-6">
      {/* Hero */}
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-12">
        <video
          src="/Loop_vid.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full opacity-70 object-cover"
        /><video/>
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

      <div className="mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
          About Horizon Tech Fest
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <p className="text-base md:text-lg mb-4">
              Horizon Fest is an annual tech event by the CS-IT Department of
              Kirti M. Doongursee College, established in 2000. Inspired by the
              motto
              <span className="font-semibold">“Unity is Strength”</span>, it
              unites students through technology with events like Conexa, a
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
                <h3 className="font-bold mb-1">4 Days</h3>{" "}
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Of Tech Innovation
                </p>
              </CardContent>
            </Card>{" "}
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

      <div className="mb-12 md:mb-16">
        {/* College Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center mb-12">
          <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="https://kirticollege.edu.in/wp-content/uploads/2024/06/8505b33d-6da5-45d7-990b-987c23b9d578-1024x768.jpeg" // replace with actual college image from https://kirticollege.edu.in/
              alt="Kirti M. Doongursee College Campus"
              height={630}
              width={940}
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              About the College
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Kirti M. Doongursee College of Arts, Science and Commerce,
              established in 1954 by the Deccan Education Society, is one of the
              well-known institutions in Dadar, Mumbai. Affiliated with the
              University of Mumbai and accredited with an “A” grade by NAAC, the
              college offers a wide range of programs at the junior,
              undergraduate, and postgraduate levels. With its strong academic
              foundation, dedicated faculty, and long tradition of excellence,
              Kirti College continues to shape students into capable individuals
              ready to face the challenges of the future.
            </p>
          </div>
        </div>
      </div>

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
                Hackathon 2025
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                A 24-hour coding marathon where teams compete to build
                innovative solutions to real-world problems.
              </p>
              <Badge variant="outline">Competition</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
              <Cpu className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-2">AI Summit</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Explore the latest advancements in artificial intelligence with
                industry leaders and researchers.
              </p>
              <Badge variant="outline">Conference</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
              <Globe className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-2">Tech Expo</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Discover cutting-edge products and services from startups and
                established tech companies.
              </p>
              <Badge variant="outline">Exhibition</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
              <Users className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-2">
                Networking Mixer
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Connect with fellow tech enthusiasts, potential collaborators,
                and industry professionals.
              </p>
              <Badge variant="outline">Networking</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
              <Lightbulb className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-2">
                Startup Pitch
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Watch innovative startups pitch their ideas to investors and
                compete for funding.
              </p>
              <Badge variant="outline">Competition</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
              <Code className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-2">Workshops</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Hands-on sessions covering various technologies, from web
                development to quantum computing.
              </p>
              <Badge variant="outline">Learning</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Meet Our Team Section */}
      <section className="mb-24 px-4 md:px-12" aria-labelledby="team-heading">
        {/* Heading */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 id="team-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
            Meet Our Team
          </h2>
          <p className="text-gray-300 text-base md:text-lg">
            Horizon Tech Fest is organized by a dedicated team of technology enthusiasts and professionals dedicated to creating an unforgettable experience for every participant.
          </p>
        </div>

        {/* President */}
        {president && (
          <div className="flex justify-center mb-12">
            <Card className="bg-muted/10 p-6 rounded-xl text-center w-full max-w-xs hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-0 flex flex-col items-center">
                <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden mb-4 border-2 border-gray-900 group transition-all duration-300">
                  <Image
                    src={president.image || "/placeholder.svg"}
                    alt={president.name || "President"}
                    fill
                    className="object-cover"
                    aria-label={`${president.name || "President"} Photo`}
                  />
                </div>
                <p className="uppercase text-lg font-extrabold text-indigo-100 mb-2">
                  President
                </p>
                <h3 className="text-2xl font-bold text-white mb-1">{president.name}</h3>
                <p className="text-gray-300 text-sm italic">{president.slogan}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Vice Presidents */}
        {vps.length > 0 && (
          <div className="flex justify-center mb-12">

            {vps.map((vp) => (
              <Card
                key={vp.designation}
                className="bg-muted/10 p-6 rounded-xl text-center w-full max-w-xs hover:shadow-2xl transition-shadow duration-300"
              >
                <CardContent className="p-0 flex flex-col items-center">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden mb-4 border-2 border-gray-900 group transition-all duration-300">
                    <Image
                      src={vp.image || "/placeholder.svg"}
                      alt={vp.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="uppercase text-lg font-extrabold text-indigo-100 mb-2">
                    Vice President
                  </p>
                  <h3 className="text-2xl font-bold text-white mb-1">{vp.name}</h3>
                  <p className="text-gray-300 text-sm italic">{vp.slogan}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}


        {/* Secretary */}
        {secretary && (
          <div className="flex justify-center mb-16">
            <Card className="bg-muted/10 p-6 rounded-xl text-center w-full max-w-xs hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-0 flex flex-col items-center">
                <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden mb-4 border-2 border-gray-900 group transition-all duration-300">
                  <Image
                    src={secretary.image || "/placeholder.svg"}
                    alt={secretary.name || "Secretary"}
                    fill
                    className="object-cover"
                    aria-label={`${secretary.name || "Secretary"} Photo`}
                  />
                </div>
                <p className="uppercase text-lg font-extrabold text-indigo-100 mb-2">
                  Secretary
                </p>
                <h3 className="text-xl font-bold text-white mb-1">{secretary.name}</h3>
                <p className="text-gray-300 text-sm italic">{secretary.slogan}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Other Teams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teams.map((team, idx) => (
            <Card
              key={team.title || idx}
              className="bg-muted/10 p-6 rounded-xl hover:shadow-xl transition-shadow duration-300 w-full"
            >
              <CardContent>
                <h3 className="text-lg md:text-xl font-bold mb-6 text-white">{team.title}</h3>

                {/* Inner flexible row */}
                <div className="flex flex-wrap justify-center gap-6">
                  {[team.head, team.cohead].map((person, i) =>
                    person ? (
                      <div
                        key={person.designation || person.name || i}
                        className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300 flex-1 min-w-[140px] max-w-[200px]"
                      >
                        <p className="uppercase text-sm font-extrabold text-indigo-100 mb-2">
                          {person.designation}
                        </p>

                        <div className="relative w-[100%] aspect-square max-w-[120px] rounded-lg overflow-hidden mb-3 border-2 border-gray-900 group transition-all duration-300">
                          <Image
                            src={person.image || "/placeholder.svg"}
                            alt={person.name || person.designation}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <h4 className="text-white font-bold">{person.name}</h4>
                        <p className="text-gray-300 text-sm italic">{person.slogan}</p>
                      </div>
                    ) : null
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </section>

    </div>
  );
}

// // Build the teams you want to display
// const teams = [
//   {
//     title: "Technical Team",
//     head: teamMembers.find((m) => m.designation === "Technical Head"),
//     cohead: teamMembers.find((m) => m.designation === "Technical Co-Head"),
//   },
//   {
//     title: "Creative Team",
//     head: teamMembers.find((m) => m.designation === "Creative Head"),
//     cohead: teamMembers.find((m) => m.designation === "Creative Co-Head"),
//   },
//   {
//     title: "Management Team",
//     head: teamMembers.find((m) => m.designation === "Management Head"),
//     cohead: teamMembers.find((m) => m.designation === "Management Co-Head"),
//   },
//   {
//     title: "Marketing Team",
//     head: teamMembers.find((m) => m.designation === "Marketing Head"),
//     cohead: teamMembers.find((m) => m.designation === "Marketing Co-Head"),
//   },
//   {
//     title: "Hospitality Team",
//     head: teamMembers.find((m) => m.designation === "Hospitality Head"),
//     cohead: teamMembers.find((m) => m.designation === "Hospitality Co-Head"),
//   },
//   {
//     title: "Mass Media Team",
//     head: teamMembers.find((m) => m.designation === "Mass Media Head"),
//     cohead: teamMembers.find((m) => m.designation === "Media Co-Head"),
//   },
// ];

// export const metadata: Metadata = {
//   title: "About Horizon Tect Fest 2025",
//   description:
//     "Learn more about Horizon Tect Fest 2025 — its mission, vision, and the team behind the scenes.",
// };

// export default function AboutPage() {
//   return (
//     <div className="container max-w-7xl py-8 mx-auto px-4 md:px-6">
//       {/* Hero Section */}
//       <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8 md:mb-12">
//         <Image
//           src="https://gjewacuwtvvhxoazxrco.supabase.co/storage/v1/object/public/events/horizon_og.png" // replace with actual event image
//           alt="Horizon Tech Fest 2025"
//           fill
//           className="object-cover"
//           priority
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex flex-col justify-center p-4 sm:p-8">
//           <Badge className="mb-2 w-fit" variant="secondary">
//             May 15-18, 2025
//           </Badge>
//           <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4">
//             Horizon Tech Fest 2025
//           </h1>
//           <p className="text-base sm:text-xl md:text-2xl text-white/90 max-w-2xl">
//             Hello Tech World 2025: Exploring the Frontiers of Innovation
//           </p>
//         </div>
//       </div>

//       {/* About Section */}
//       <div className="mb-12 md:mb-16">
//         <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
//           About Horizon Tech Fest
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
//           <div>
//             <p className="text-base md:text-lg mb-4">
//               Horizon Fest is an annual tech event by the CS-IT Department of
//               Kirti M. Doongursee College, established in 2000. Inspired by the
//               motto
//               <span className="font-semibold">“Unity is Strength”</span>, it
//               unites students through technology with events like Conexa, a
//               networking platform, and coding competitions. Horizon Fest fosters
//               creativity, innovation, and collaboration, making it a must-attend
//               for tech enthusiasts.
//             </p>
//             <p className="text-base md:text-lg mb-4">
//               Our 2025 theme, &quot;Hello Tech World,&quot; invites participants
//               to explore the frontiers of innovation and reimagine the future of
//               technology. From artificial intelligence and blockchain to quantum
//               computing and sustainable tech, Horizon Tech Fest 2025 will be a
//               celebration of human ingenuity and technological advancement.
//             </p>
//             <div className="flex flex-wrap gap-4 mt-6">
//               <Button asChild>
//                 <Link href="/events">Explore Events</Link>
//               </Button>
//               <Button variant="outline" asChild>
//                 <Link href="/contact">Contact Us</Link>
//               </Button>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <Card className="bg-muted/50">
//               <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
//                 <Calendar className="h-8 w-8 md:h-10 md:w-10 mb-3 md:mb-4 text-primary" />
//                 <h3 className="font-bold mb-1">4 Days</h3>
//                 <p className="text-xs sm:text-sm text-muted-foreground">
//                   Of Tech Innovation
//                 </p>
//               </CardContent>
//             </Card>
//             <Card className="bg-muted/50">
//               <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
//                 <MapPin className="h-8 w-8 md:h-10 md:w-10 mb-3 md:mb-4 text-primary" />
//                 <h3 className="font-bold mb-1">5 Venues</h3>
//                 <p className="text-xs sm:text-sm text-muted-foreground">
//                   Across the City
//                 </p>
//               </CardContent>
//             </Card>
//             <Card className="bg-muted/50">
//               <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
//                 <Users className="h-8 w-8 md:h-10 md:w-10 mb-3 md:mb-4 text-primary" />
//                 <h3 className="font-bold mb-1">10,000+</h3>
//                 <p className="text-xs sm:text-sm text-muted-foreground">
//                   Expected Attendees
//                 </p>
//               </CardContent>
//             </Card>
//             <Card className="bg-muted/50">
//               <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
//                 <Zap className="h-8 w-8 md:h-10 md:w-10 mb-3 md:mb-4 text-primary" />
//                 <h3 className="font-bold mb-1">50+</h3>
//                 <p className="text-xs sm:text-sm text-muted-foreground">
//                   Tech Events
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* College Info & Horizon Fest Section */}
//       <div className="mb-12 md:mb-16">
//         {/* College Info */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center mb-12">
//           <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
//             <Image
//               src="https://kirticollege.edu.in/wp-content/uploads/2024/06/8505b33d-6da5-45d7-990b-987c23b9d578-1024x768.jpeg" // replace with actual college image from https://kirticollege.edu.in/
//               alt="Kirti M. Doongursee College Campus"
//               height={630}
//               width={940}
//               className="object-cover"
//             />
//           </div>
//           <div>
//             <h2 className="text-2xl md:text-3xl font-bold mb-4">
//               About the College
//             </h2>
//             <p className="text-base md:text-lg text-muted-foreground">
//               Kirti M. Doongursee College of Arts, Science and Commerce,
//               established in 1954 by the Deccan Education Society, is one of the
//               well-known institutions in Dadar, Mumbai. Affiliated with the
//               University of Mumbai and accredited with an “A” grade by NAAC, the
//               college offers a wide range of programs at the junior,
//               undergraduate, and postgraduate levels. With its strong academic
//               foundation, dedicated faculty, and long tradition of excellence,
//               Kirti College continues to shape students into capable individuals
//               ready to face the challenges of the future.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Theme Section */}
//       <div className="mb-12 md:mb-16 bg-muted/30 p-4 sm:p-6 md:p-8 rounded-xl">
//         <div className="max-w-3xl mx-auto text-center">
//           <Badge variant="outline" className="mb-4">
//             2025 Theme
//           </Badge>
//           <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
//             Hello Tech World 2025
//           </h2>
//           <p className="text-base md:text-lg mb-6">
//             Our theme for 2025 celebrates the convergence of technology and
//             human creativity. &quot;Hello Tech World&quot; is more than just a
//             greeting—it&apos;s an invitation to explore, innovate, and shape the
//             future of technology together.
//           </p>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
//             <div className="flex flex-col items-center">
//               <Globe className="h-10 w-10 md:h-12 md:w-12 text-primary mb-3 md:mb-4" />
//               <h3 className="font-bold mb-1 md:mb-2">Global Connection</h3>
//               <p className="text-xs md:text-sm text-muted-foreground">
//                 Bringing together tech communities from around the world
//               </p>
//             </div>
//             <div className="flex flex-col items-center">
//               <Code className="h-10 w-10 md:h-12 md:w-12 text-primary mb-3 md:mb-4" />
//               <h3 className="font-bold mb-1 md:mb-2">Innovation</h3>
//               <p className="text-xs md:text-sm text-muted-foreground">
//                 Showcasing breakthrough technologies and ideas
//               </p>
//             </div>
//             <div className="flex flex-col items-center">
//               <Lightbulb className="h-10 w-10 md:h-12 md:w-12 text-primary mb-3 md:mb-4" />
//               <h3 className="font-bold mb-1 md:mb-2">Inspiration</h3>
//               <p className="text-xs md:text-sm text-muted-foreground">
//                 Sparking creativity and new possibilities
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Event Highlights */}
//       <div className="mb-12 md:mb-16">
//         <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
//           Event Highlights
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//           <Card>
//             <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
//               <Award className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
//               <h3 className="text-lg md:text-xl font-bold mb-2">
//                 Hackathon 2025
//               </h3>
//               <p className="text-sm md:text-base text-muted-foreground mb-4">
//                 A 24-hour coding marathon where teams compete to build
//                 innovative solutions to real-world problems.
//               </p>
//               <Badge variant="outline">Competition</Badge>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
//               <Cpu className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
//               <h3 className="text-lg md:text-xl font-bold mb-2">AI Summit</h3>
//               <p className="text-sm md:text-base text-muted-foreground mb-4">
//                 Explore the latest advancements in artificial intelligence with
//                 industry leaders and researchers.
//               </p>
//               <Badge variant="outline">Conference</Badge>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
//               <Globe className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
//               <h3 className="text-lg md:text-xl font-bold mb-2">Tech Expo</h3>
//               <p className="text-sm md:text-base text-muted-foreground mb-4">
//                 Discover cutting-edge products and services from startups and
//                 established tech companies.
//               </p>
//               <Badge variant="outline">Exhibition</Badge>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
//               <Users className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
//               <h3 className="text-lg md:text-xl font-bold mb-2">
//                 Networking Mixer
//               </h3>
//               <p className="text-sm md:text-base text-muted-foreground mb-4">
//                 Connect with fellow tech enthusiasts, potential collaborators,
//                 and industry professionals.
//               </p>
//               <Badge variant="outline">Networking</Badge>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
//               <Lightbulb className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
//               <h3 className="text-lg md:text-xl font-bold mb-2">
//                 Startup Pitch
//               </h3>
//               <p className="text-sm md:text-base text-muted-foreground mb-4">
//                 Watch innovative startups pitch their ideas to investors and
//                 compete for funding.
//               </p>
//               <Badge variant="outline">Competition</Badge>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
//               <Code className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
//               <h3 className="text-lg md:text-xl font-bold mb-2">Workshops</h3>
//               <p className="text-sm md:text-base text-muted-foreground mb-4">
//                 Hands-on sessions covering various technologies, from web
//                 development to quantum computing.
//               </p>
//               <Badge variant="outline">Learning</Badge>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Our Team */}
//       <div className="mb-12 md:mb-16">
//         <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
//           Meet Our Team
//         </h2>
//         <p className="text-base md:text-lg mb-6 md:mb-8 max-w-3xl">
//           Horizon Tech Fest is organized by a dedicated team of technology
//           enthusiasts and professionals committed to creating an unforgettable
//           experience for all participants.
//         </p>
//       </div>

//       <div className="flex flex-col items-center gap-12 mb-12">
//         {/* President */}
//         <Card className="bg-muted/10 p-4 sm:p-6 rounded-xl text-center w-full max-w-[90%] sm:max-w-xs">
//           <CardContent className="p-0 flex flex-col items-center">
//             <div className="w-full aspect-[2/3] rounded-lg overflow-hidden mb-4 border-2 border-gray-900 group transition-all duration-300">
//               <Image
//                 src={
//                   teamMembers.find((m) => m.designation === "President")
//                     ?.image || "/placeholder.svg"
//                 }
//                 alt={
//                   teamMembers.find((m) => m.designation === "President")
//                     ?.name || ""
//                 }
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <p className="text-indigo-100 uppercase text-lg sm:text-xl font-extrabold mb-2">
//               President
//             </p>
//             <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
//               {teamMembers.find((m) => m.designation === "President")?.name}
//             </h3>
//             <p className="text-gray-300 text-sm italic">
//               {teamMembers.find((m) => m.designation === "President")?.slogan}
//             </p>
//           </CardContent>
//         </Card>

//         <div className="flex flex-col sm:flex-row justify-center gap-6 w-full">
//           {["Vice President 1", "Vice President 2"].map((vp, index) => {
//             const member = teamMembers.find((m) => m.designation === vp);
//             return (
//               <Card
//                 key={index}
//                 className="bg-muted/10 p-4 sm:p-6 rounded-xl text-center w-full max-w-[90%] sm:max-w-xs"
//               >
//                 <CardContent className="p-0 flex flex-col items-center">
//                   <div className="w-full aspect-[2/3] rounded-lg overflow-hidden mb-4 border-2 border-gray-900 group transition-all duration-300">
//                     <Image
//                       src={member?.image || "/placeholder.svg"}
//                       alt={member?.name || ""}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <p className="text-indigo-100 uppercase text-lg sm:text-xl font-extrabold mb-2">
//                     Vice President
//                   </p>
//                   <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
//                     {member?.name}
//                   </h3>
//                   <p className="text-gray-300 text-sm italic">
//                     {member?.slogan}
//                   </p>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         {/* Secretary */}
//         <Card className="bg-muted/10 p-6 rounded-xl text-center max-w-xs">
//           <CardContent className="p-0 flex flex-col items-center">
//             <div className="w-[240px] h-[330px] rounded-lg overflow-hidden mb-4 border-2 border-gray-900 group transition-all duration-300">
//               <Image
//                 src={
//                   teamMembers.find((m) => m.designation === "Secretary")
//                     ?.image || "/placeholder.svg"
//                 }
//                 alt={
//                   teamMembers.find((m) => m.designation === "Secretary")
//                     ?.name || ""
//                 }
//                 width={240}
//                 height={330}
//                 className="object-cover"
//               />
//             </div>
//             <p className="text-indigo-100 uppercase text-xl font-extrabold mb-2">
//               Secretary
//             </p>
//             <h3 className="text-2xl font-bold text-white mb-1">
//               {teamMembers.find((m) => m.designation === "Secretary")?.name}
//             </h3>
//             <p className="text-gray-300 text-sm italic">
//               {teamMembers.find((m) => m.designation === "Secretary")?.slogan}
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Other Teams */}
//       <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
//         {teams.map((team) => (
//           <Card key={team.title} className="bg-muted/10 p-6 rounded-xl">
//             <CardContent className="p-0">
//               <h3 className="text-lg md:text-xl font-bold mb-4">
//                 {team.title}
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 {/* Head */}
//                 <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg">
//                   <p className="text-indigo-100 uppercase text-sm font-extrabold mb-2">
//                     {team.head?.designation}
//                   </p>
//                   <div className="w-[140px] h-[140px] rounded-lg overflow-hidden mb-3">
//                     <Image
//                       src={
//                         team.head?.image || team.head?.image || "/placeholder.svg"
//                       }
//                       alt={team.head?.name || ""}
//                       width={140}
//                       height={140}
//                       className="object-cover"
//                     />
//                   </div>
//                   <h4 className="text-white font-bold">{team.head?.name}</h4>
//                   <p className="text-gray-300 text-sm mt-1 italic">
//                     {team.head?.slogan}
//                   </p>
//                 </div>

//                 {/* Co-Head */}
//                 <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg">
//                   <p className="text-indigo-100 uppercase text-sm font-extrabold mb-2">
//                     {team.cohead?.designation}
//                   </p>
//                   <div className="w-[140px] h-[140px] rounded-lg overflow-hidden mb-3">
//                     <Image
//                       src={
//                         team.cohead?.image ||
//                         team.cohead?.image ||
//                         "/placeholder.svg"
//                       }
//                       alt={team.cohead?.name || ""}
//                       width={140}
//                       height={140}
//                       className="object-cover"
//                     />
//                   </div>
//                   <h4 className="text-white font-bold">{team.cohead?.name}</h4>
//                   <p className="text-gray-300 text-sm mt-1 italic">
//                     {team.cohead?.slogan}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* CTA Section */}
//       <div className="bg-primary/10 rounded-xl p-4 sm:p-6 md:p-8 text-center">
//         <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">
//           Join Us at Horizon Tech Fest 2025
//         </h2>
//         <p className="text-base md:text-lg mb-4 md:mb-6 max-w-2xl mx-auto">
//           Be part of the most exciting tech event of the year. Register now to
//           secure your spot!
//         </p>
//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <Button size="lg" asChild>
//             <Link href="/events">Browse Events</Link>
//           </Button>
//           <Button size="lg" variant="outline" asChild>
//             <Link href="/contact">Contact Us</Link>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
