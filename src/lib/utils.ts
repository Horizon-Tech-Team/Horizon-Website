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
    name: "Code Wars",
    description: "A high-intensity coding face-off where logic meets adrenaline.",
    category: "TECHNICAL SKILL",
    banner_url: "/events/event1.jpg",
    start_time: "2025-05-01T10:00:00",
    venue: "Lab 302",
    is_team_event: true,
    registration_link: "https://forms.google.com/example",
  },
  {
    uid: "ev2",
    name: "DebateX",
    description: "A battle of words judged by industry experts.",
    category: "VERBAL AND EXPRESSIVE",
    banner_url: "/events/event2.jpg",
    start_time: "2025-05-02T12:00:00",
    venue: "Auditorium",
    registration_link: "https://forms.google.com/example",
  },
  {
    uid: "ev3",
    name: "Tech Expo",
    description: "Showcase your projects and innovations.",
    category: "TECH-SPOTLIGHT",
    banner_url: "/events/event3.jpg",
    start_time: "2025-05-03T11:00:00",
    venue: "Hall A",
    registration_link: "https://forms.google.com/example",
  },
  {
    uid: "ev4",
    name: "Design Sprint",
    description: "A rapid-fire UI/UX competition.",
    category: "CREATIVE",
    banner_url: "/events/event4.jpg",
    start_time: "2025-05-04T09:00:00",
    venue: "Studio 1",
    registration_link: "https://forms.google.com/example",
  },
  {
    uid: "ev5",
    name: "Mystery Hunt",
    description: "A thrilling analytical treasure hunt.",
    category: "LOGICAL & ANALYTICAL",
    banner_url: "/events/event5.jpg",
    start_time: "2025-05-05T15:00:00",
    venue: "Campus Grounds",
    registration_link: "https://forms.google.com/example",
  },
  {
    uid: "ev6",
    name: "FunZone Games",
    description: "Mini games, fun challenges and chaos.",
    category: "FUN & INTERACTIVE SIDE GAMES",
    banner_url: "/events/event6.jpg",
    start_time: "2025-05-06T14:00:00",
    venue: "Play Area",
    registration_link: "https://forms.google.com/example",
  },
  {
    uid: "ev7",
    name: "AI Hackathon",
    description: "Build the future with AI in this 24-hour hackathon.",
    category: "TECHNICAL SKILL",
    banner_url: "/events/event7.jpg",
    start_time: "2025-05-07T09:00:00",
    venue: "Innovation Hub",
    is_team_event: true,
    registration_link: "https://forms.google.com/example",
  },
  {
    uid: "ev8",
    name: "Stand-up Comedy",
    description: "Laugh out loud with the best campus comedians.",
    category: "VERBAL AND EXPRESSIVE",
    banner_url: "/events/event8.jpg",
    start_time: "2025-05-07T18:00:00",
    venue: "Main Auditorium",
    registration_link: "https://forms.google.com/example",
  },
  {
    uid: "ev9",
    name: "Robo Soccer",
    description: "Robots battling it out on the soccer field.",
    category: "TECH-SPOTLIGHT",
    banner_url: "/events/event9.jpg",
    start_time: "2025-05-08T10:00:00",
    venue: "Robotics Lab",
    is_team_event: true,
    registration_link: "https://forms.google.com/example",
  },
  {
    uid: "ev10",
    name: "Photography Contest",
    description: "Capture the best moments of the fest.",
    category: "CREATIVE",
    banner_url: "/events/event10.jpg",
    start_time: "2025-05-08T12:00:00",
    venue: "Campus Wide",
    registration_link: "https://forms.google.com/example",
  },
];
