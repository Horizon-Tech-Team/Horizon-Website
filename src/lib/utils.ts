import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toZonedTime, format } from "date-fns-tz";
import { Event } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getYearLabel = (year: number) => {
  if (year === 1) return `${year}st`;
  if (year === 2) return `${year}nd`;
  if (year === 3) return `${year}rd`;
  return `${year}th`;
};

const timeZone = "Asia/Kolkata";

export const formatDate = (dateString: string) => {
  const date = toZonedTime(new Date(dateString), timeZone); // Convert UTC to Kolkata time
  return format(date, "EEEE, d MMMM yyyy", { timeZone }); // e.g., "Thursday, 1 May 2025"
};

export const formatTime = (dateString: string) => {
  const date = toZonedTime(new Date(dateString), timeZone); // Convert UTC to Kolkata time
  return format(date, "hh:mm a", { timeZone }); // e.g., "03:30 PM"
};

export const calculateDaysRemaining = (dateString: string) => {
  const today = new Date();
  const eventDate = new Date(dateString);
  const timeDiff = eventDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
};

export function toISOStringLocal(dateStr: string, timeStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  const d = new Date(year, month - 1, day, hour, minute); // month is 0-based
  return d.toISOString().slice(0, 19); // 'YYYY-MM-DDTHH:mm:ss'
}



export const staticEvents: Event[] = [
  {
    uid: "ev1",
    name: "Tech Spotlight",
    description: "Explore cutting-edge innovations and showcase your tech brilliance.",
    category: "TECH-SPOTLIGHT",
    banner_url: "/events/tech_spotlight.png",
    start_time: "2025-05-01T10:00:00",
    venue: "Main Hall",
    is_team_event: true,
    registration_link: "https://forms.google.com/example",
  },
  {
    uid: "ev2",
    name: "Technical Events",
    description: "Put your engineering and problem-solving skills to the test.",
    category: "TECHNICAL EVENTS",
    banner_url: "/events/technical_skill.png",
    start_time: "2025-05-02T10:00:00",
    venue: "Labs",
    is_team_event: true,
    registration_link: "https://forms.google.com/example",
  },
  {
    uid: "ev3",
    name: "Analytical Events",
    description: "Decode puzzles and data-driven challenges with sharp logic.",
    category: "ANALYTICAL EVENTS",
    banner_url: "/events/logical_analytical.png",
    start_time: "2025-05-03T10:00:00",
    venue: "Seminar Hall",
    is_team_event: true,
    registration_link: "https://forms.google.com/example",
  },
  {
    uid: "ev4",
    name: "Verbal Events",
    description: "Express, debate, and articulate your ideas with confidence.",
    category: "VERBAL EVENTS",
    banner_url: "/events/verbal_expressive.png",
    start_time: "2025-05-04T10:00:00",
    venue: "Auditorium",
    is_team_event: false,
    registration_link: "https://forms.google.com/example",
  },
  {
    uid: "ev5",
    name: "Creative Events",
    description: "Let imagination run wild through art, design, and storytelling.",
    category: "CREATIVE EVENTS",
    banner_url: "/events/creative.png",
    start_time: "2025-05-05T10:00:00",
    venue: "Art Studio",
    is_team_event: false,
    registration_link: "https://forms.google.com/example",
  },
  {
    uid: "ev6",
    name: "Fun Events",
    description: "Unwind and enjoy light-hearted competitions that bring out your playful side!",
    category: "FUN EVENTS",
    banner_url: "/events/fun_interactive.png",
    start_time: "2025-05-06T10:00:00",
    venue: "Grounds",
    is_team_event: true,
    registration_link: "https://forms.google.com/example",
  },
];
