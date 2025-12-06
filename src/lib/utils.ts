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
    name: "HACKATHON",
    description: "A two-day event to design and build theme based projects two days of development,followed by presentations on Day 3. Tools andframeworks allowed with credit",
    category: "TECH-SPOTLIGHT",
    banner_url: "/events/hackathon.png",
    start_time: "2026-01-06T10:30:00",
    venue: "JSKB LAB",
    is_team_event: true,
    registration_link: "https://forms.gle/cYimWffA28vKoXjt8",
  },
  {
    uid: "ev2",
    name: "EXHIBITION",
    description: "A two-day exhibition where teams showcase original IoT, robotics, or software projects at assigned stalls, engaging visitors with their concepts and functionality.",
    category: "TECH-SPOTLIGHT",
    banner_url: "/events/exhibition.png",
    start_time: "2026-01-06T10:30:00",
    venue: "GROUND",
    is_team_event: true,
    registration_link: "https://forms.gle/vgQYNJQjffokyinJ7",
  },

  {
    uid: "ev3",
    name: "Speed Coding Challenge",
    description: "Race against the clock to solve coding challenges and become the fastest Coder on Campus!",
    category: "TECHNICAL EVENTS",
    banner_url: "/events/speed coding challenge.png",
    start_time: "2026-01-06T10:30:00",
    venue: "LAB 1",
    is_team_event: false,
    registration_link: "https://forms.gle/bCLZtSqBg5Rw5rSk9",
  },

  {
    uid: "ev4",
    name: "TECHNICAL QUIZ",
    description: "test your tech knowledge and logic skills in this fast-paced quiz covering programming, networking, and emerging trends.",
    category: "TECHNICAL EVENTS",
    banner_url: "/events/tech quiz.png",
    start_time: "2026-01-06T11:00:00",
    venue: "ICT LAB",
    is_team_event: false,
    registration_link: "https://forms.gle/bzUbqYnJUNDgrnPL7",
  },

  {
    uid: "ev5",
    name: "WEB DESIGNING COMPETITION",
    description: "Showcase your creativity and skills by designing stunning, responsive websites in this web designing competition.",
    category: "TECHNICAL EVENTS",
    banner_url: "/events/web.png",
    start_time: "2026-01-06T12:00:00",
    venue: "LAB 1",
    is_team_event: false,
    registration_link: "https://forms.gle/kqh5dVjvfHeNqaT2A",
  },

  {
    uid: "ev6",
    name: "ALGORITHM CHALLENGE",
    description: "Solve real-world coding problems with efficient algorithms in this intense programming and logic challenge",
    category: "TECHNICAL EVENTS",
    banner_url: "/events/Algo challenge.png",
    start_time: "2026-01-06T14:00:00",
    venue: "LAB 1",
    is_team_event: false,
    registration_link: "https://forms.gle/pptjYc65nCbVkh4o6",
  },

  {
    uid: "ev7",
    name: "SOFTWARE ENGINEERING",
    description: "Design clear and creative software architecture diagrams to solve real-world problems using draw.io or similar tools.",
    category: "TECHNICAL EVENTS",
    banner_url: "/events/software engineering.png",
    start_time: "2026-01-07T10:00:00",
    venue: "LAB 1",
    is_team_event: false,
    registration_link: "https://forms.gle/UuJnK3eQfDRCLUFS9",
  },

  {
    uid: "ev8",
    name: "REVERSE ENGINEERING",
    description: "Analyze and unravel pre-built systems or code to decode, exploit, or reverse engineer them in this tech puzzle challenge.",
    category: "TECHNICAL EVENTS",
    banner_url: "/events/reverse engineering.png",
    start_time: "2026-01-07T11:00:00",
    venue: "ICT LAB",
    is_team_event: false,
    registration_link: "https://forms.gle/xZmLuxYChA28iYoF6",
  },

  {
    uid: "ev9",
    name: "BUG BUSTERS",
    description: "Hunt down and fix hidden bugs in code faster than anyone else in this intense debugging challenge.",
    category: "TECHNICAL EVENTS",
    banner_url: "/events/bug buster.png",
    start_time: "2026-01-07T10:00:00",
    venue: "LAB 1",
    is_team_event: false,
    registration_link: "https://forms.gle/GU2131DWeYqM9wtd9",
  },

  {
    uid: "ev10",
    name: "DASHBOARD MAKING",
    description: "Create interactive dashboards to showcase data insights with strong designs, usability and story telling.",
    category: "TECHNICAL EVENTS",
    banner_url: "/events/dashboard.png",
    start_time: "2026-01-07T14:00:00",
    venue: "LAB B",
    is_team_event: false,
    registration_link: "https://forms.gle/99WcJLnLCTgoCihP6",
  },

  {
    uid: "ev11",
    name: "LOGIC PUZZLE",
    description: "Solve tech-themed jigsaw puzzles with speed and sharp logic to claim victory.",
    category: "ANALYTICAL EVENTS",
    banner_url: "/events/logic.jpg",
    start_time: "2026-01-06T12:00:00",
    venue: "2.6",
    is_team_event: false,
    registration_link: "https://forms.gle/cxgs4JnccRt7iWZs9",
  },

  {
    uid: "ev12",
    name: "SRT SITUATION REACTION TEST",
    description: "Tackle in real life scenarios to test your decision making, logic and presence of mind and under pressure",
    category: "ANALYTICAL EVENTS",
    banner_url: "/events/srt.jpg",
    start_time: "2026-01-06T14:00:00",
    venue: "2.8",
    is_team_event: false,
    registration_link: "https://forms.gle/LZkXUMXiXZrEAW378",
  },

  {
    uid: "ev13",
    name: "ESCAPE ROOM",
    description: "Use logic, teamwork and team thinking to solve puzzles and escape the room before time runs out",
    category: " ANALYTICAL EVENTS",
    banner_url: "/events/escape.jpg",
    start_time: "2026-01-07T12:00:00",
    venue: "GROUND",
    is_team_event: true,
    registration_link: "https://forms.gle/4VNGucTMf9GFTbKy8",
  },

{
    uid: "ev14",
    name: "TRIVIA(RAPID-FIRE)",
    description: "Test your reflex and knowledge in this rapid-fire trivia quiz covering tech, pop culture,science, and more.",
    category: "ANALYTICAL EVENTS",
    banner_url: "/events/trivia.jpg",
    start_time: "2026-01-07T14:00:00",
    venue: "2.8",
    is_team_event: false,
    registration_link: "https://forms.gle/R3pPr487jZKp9vRs7",
  },
  
  {
    uid: "ev15",
    name: "MOCK INTERVIEW",
    description: "Experience real interview scenarios with personalized feedback to boost your confidence and job readiness",
    category: "VERBAL EVENTS",
    banner_url: "/events/mock interview.png",
    start_time: "2026-01-06T14:00:00",
    venue: "LAB B",
    is_team_event: false,
    registration_link: "https://forms.gle/qJVAzRgquJoWJqBb7",
  },

  
  {
    uid: "ev16",
    name: "TECH MEME",
    description: "Create original tech memes by showcasing your with and humor in this ultimate meme making challenge.",
    category: "CREATIVE EVENTS",
    banner_url: "/events/tech meme.png",
    start_time: "2026-01-06T15:00:00",
    venue: "LAB 1",
    is_team_event: false,
    registration_link: "https://forms.gle/QAhQBNPwruQnjarG6",
  },

{
    uid: "ev17",
    name: "DIGITAL POSTER",
    description: "Showcase your creativity and artistry by bringing imaginative concepts to life in this digital art competition",
    category: "CREATIVE EVENTS",
    banner_url: "/events/digital poster.png",
    start_time: "2026-01-07T12:00:00",
    venue: "ICT LAB",
    is_team_event: false,
    registration_link: "https://forms.gle/Ud9rkEHeN1WPkyAm6",
  },

{
    uid: "ev18",
    name: "PHOTO STORY",
    description: "Capture and narrate the essence of the tech fest through powerful,story-driven photography",
    category: "CREATIVE EVENTS",
    banner_url: "/events/photostory.png",
    start_time: "2026-01-07T15:00:00",
    venue: "ICT LAB",
    is_team_event: false,
    registration_link: "https://forms.gle/zDMNuZcqjWPF9ufr6",
  },

  {
    uid: "ev19",
    name: "TIC TAC TOE",
    description: "Play Tic Tac Toe  simple, familiar, and not at all what it seems",
    category: "FUN EVENTS",
    banner_url: "/events/Tic tac toe.png",
    start_time: "2026-01-06",
    venue: "JSKB",
    is_team_event: false,
    registration_link: "https://forms.gle/26ZXFjjGxtT7GenEA",
  },

  {
    uid: "ev20",
    name: "CHESS",
    description: "Outsmart your opponent in this ultimate game of strategy.",
    category: "FUN EVENTS",
    banner_url: "/events/chess.png",
    start_time: "2026-01-06",
    venue: "JSKB",
    is_team_event: false,
    registration_link: "https://forms.gle/uzHmwGL6QD1A8HW68",
  },

  
];
