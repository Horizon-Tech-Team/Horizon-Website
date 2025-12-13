// src/app/schedule/page.tsx  (or src/components/SchedulePage.tsx)
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import ParticleBackground from "@/components/one-time/ParticleBackground";

/**
 * Schedule page with a 'road' timeline layout.
 * Edit `day1Events` and `day2Events` arrays below with real data.
 */

type EventItem = {
    id: string;
    timeStart: string; // "10:30"
    timeEnd?: string; // "11:00"
    title: string;
    category?: string;
    eventHead?: string;
    contact?: string;
    venue?: string;
    notes?: string;
    durationMinutes?: number;
};

const day1Events: EventItem[] = [
    {
        id: "d1-e1",
        timeStart: "10:30",
        timeEnd: "11:00",
        title: "Speed Coding",
        category: "Technical",
        eventHead: "Aman",
        contact: "72087 49320",
        venue: "Lab 1",
    },
    {
        id: "d1-e2",
        timeStart: "10:30",
        timeEnd: "15:30",
        title: "Tic-Tac-Toe",
        category: "Fun Events",
        eventHead: "-",
        contact: "—",
        venue: "—",
    },
    {
        id: "d1-e3",
        timeStart: "11:00",
        timeEnd: "12:00",
        title: "Technical Quiz",
        category: "Technical",
        eventHead: "Parth",
        contact: "85910 57895",
        venue: "ICT",
    },
    {
        id: "d1-e4",
        timeStart: "10:30",
        timeEnd: "15:30",
        title: "Chess",
        category: "Fun Events",
        eventHead: "-",
        contact: "—",
        venue: "—",
    },
    {
        id: "d1-e5",
        timeStart: "12:00",
        timeEnd: "13:00",
        title: "Web Designing",
        category: "Technical",
        eventHead: "—",
        contact: "—",
        venue: "Lab 1",
    },
    {
        id: "d1-e6",
        timeStart: "12:00",
        timeEnd: "13:00",
        title: "Logical Puzzle",
        category: "Analytical",
        eventHead: "Subhecha",
        contact: "88504 43040",
        venue: "2.6",
    },
    {
        id: "d1-e7",
        timeStart: "13:00",
        timeEnd: "14:00",
        title: "Lunch",
        category: "Break",
        eventHead: "—",
        contact: "—",
        venue: "—",
    },
    {
        id: "d1-e8",
        timeStart: "14:00",
        timeEnd: "15:00",
        title: "Algorithm Challenge",
        category: "Technical",
        eventHead: "Sohit",
        contact: "88509 69434",
        venue: "Lab 1",
    },
    {
        id: "d1-e9",
        timeStart: "14:00",
        timeEnd: "14:30",
        title: "Mock Interview",
        category: "Verbal",
        eventHead: "Tanmay",
        contact: "77385 19534",
        venue: "Lab B",
    },
    {
        id: "d1-e10",
        timeStart: "14:30",
        timeEnd: "15:00",
        title: "SRT",
        category: "Analytical",
        eventHead: "Atharva",
        contact: "93245 85503",
        venue: "2.8",
    },
    {
        id: "d1-e11",
        timeStart: "15:00",
        timeEnd: "15:30",
        title: "Tech Meme",
        category: "Creative",
        eventHead: "—",
        contact: "—",
        venue: "Lab 1",
    },
];


const day2Events: EventItem[] = [
    {
        id: "d2-e1",
        timeStart: "10:30",
        timeEnd: "11:00",
        title: "Software Engineering",
        category: "Technical",
        eventHead: "Sohit",
        contact: "88509 69434",
        venue: "Lab 1",
    },
    {
        id: "d2-e2",
        timeStart: "10:30",
        timeEnd: "15:30",
        title: "Tic-Tac-Toe",
        category: "Fun Events",
        eventHead: "-",
        contact: "—",
        venue: "—",
    },
    {
        id: "d2-e3",
        timeStart: "11:00",
        timeEnd: "12:00",
        title: "Reverse Engineering",
        category: "Technical",
        eventHead: "Parth",
        contact: "85910 57895",
        venue: "ICT",
    },
    {
        id: "d2-e4",
        timeStart: "10:30",
        timeEnd: "15:30",
        title: "Chess",
        category: "Fun Events",
        eventHead: "-",
        contact: "—",
        venue: "—",
    },
    {
        id: "d2-e5",
        timeStart: "12:00",
        timeEnd: "13:00",
        title: "Bug Buster",
        category: "Technical",
        eventHead: "Aman",
        contact: "72087 49320",
        venue: "Lab 1",
    },
    {
        id: "d2-e6",
        timeStart: "12:00",
        timeEnd: "13:00",
        title: "Escape Room",
        category: "Analytical",
        eventHead: "Subhecha",
        contact: "88504 43040",
        venue: "Ground",
    },
    {
        id: "d2-e7",
        timeStart: "13:00",
        timeEnd: "14:00",
        title: "Lunch",
        category: "Break",
        eventHead: "—",
        contact: "—",
        venue: "—",
    },
    {
        id: "d2-e8",
        timeStart: "14:00",
        timeEnd: "15:00",
        title: "Dashboard Making",
        category: "Technical",
        eventHead: "-",
        contact: "—",
        venue: "Lab B",
    },
    {
        id: "d2-e9",
        timeStart: "14:00",
        timeEnd: "15:00",
        title: "Trivia",
        category: "Analytical",
        eventHead: "Tanmay",
        contact: "77385 19534",
        venue: "Lab B",
    },
    {
        id: "d2-e10",
        timeStart: "14:00",
        timeEnd: "15:00",
        title: "Digital Poster",
        category: "Creative",
        eventHead: "—",
        contact: "—",
        venue: "ICT",
    },
    {
        id: "d2-e11",
        timeStart: "15:00",
        timeEnd: "15:30",
        title: "Photo Story",
        category: "Creative",
        eventHead: "—",
        contact: "—",
        venue: "ICT",
    },
];


/* ---------------------------
   Small helpers
----------------------------*/
const timeLabel = (e: EventItem) =>
    e.timeEnd ? `${e.timeStart} - ${e.timeEnd}` : e.timeStart;

/* ---------------------------
   Timeline Day Component
   - Mobile: road left, events right
   - Desktop: road center, events left/right
----------------------------*/
function TimelineDay({ dayLabel, events }: { dayLabel: string; events: EventItem[] }) {
    return (
        <section className="w-full max-w-6xl mx-auto py-10 px-4">
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold">{dayLabel}</h2>
                <p className="text-sm text-muted-foreground">
                    Events are placed chronologically along the timeline.
                </p>
            </div>

            <div className="relative">
                {/* Vertical road */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-8 md:w-16 flex items-start justify-center pointer-events-none">
                    <div
                        aria-hidden
                        className="w-1.5 md:w-2 bg-gradient-to-b from-gray-300/20 to-gray-600/10 rounded-full h-full mx-auto"
                        style={{ boxShadow: "inset 0 0 8px rgba(255,255,255,0.02)" }}
                    />
                    <div
                        aria-hidden
                        className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 bg-white/10"
                    />
                </div>

                {/* Events list */}
                <div className="space-y-8 md:space-y-12">
                    {events.map((ev, idx) => {
                        const side = idx % 2 === 0 ? "left" : "right";

                        // Mobile: always "right" side (relative to the left road)
                        // Desktop: alternating

                        return (
                            <div key={ev.id} className="relative pl-12 md:pl-0">
                                {/* Dot on the road */}
                                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 top-0 mt-1.5 md:-translate-y-2 z-10">
                                    <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-white ring-2 md:ring-4 ring-black/60 shadow-lg shadow-white/20" />
                                </div>

                                {/* Content Card */}
                                <div
                                    className={`relative w-full md:w-[45%]
    ${side === "left"
                                            ? "md:mr-auto md:pr-12 text-left md:text-right"
                                            : "md:ml-auto md:pl-12 text-left"
                                        }
  `}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.45, delay: idx * 0.05 }}
                                        className="bg-zinc-900/50 border border-white/10 rounded-xl p-5 shadow-sm backdrop-blur-md hover:bg-zinc-800/50 transition-colors group"
                                    >
                                        <div
                                            className={`flex flex-col md:flex-row gap-3 md:gap-4 ${side === "left" ? "md:flex-row-reverse" : ""
                                                }`}
                                        >
                                            {/* CONTENT */}
                                            <div className="flex-1">
                                                <div
                                                    className={`flex flex-wrap items-center gap-2 mb-1 ${side === "left" ? "md:justify-end" : "md:justify-start"
                                                        }`}
                                                >
                                                    <span className="text-xs font-medium uppercase tracking-wider text-purple-400/90">
                                                        {ev.category || "Event"}
                                                    </span>

                                                    {/* Mobile time */}
                                                    <span className="md:hidden text-xs text-zinc-400 font-mono bg-zinc-800 px-2 py-0.5 rounded">
                                                        {timeLabel(ev)}
                                                    </span>
                                                </div>

                                                <h3
                                                    className={`text-lg md:text-xl font-bold text-white mb-2 ${side === "left" ? "md:text-right" : "md:text-left"
                                                        }`}
                                                >
                                                    {ev.title}
                                                </h3>

                                                <div className="space-y-1 text-sm text-zinc-400">
                                                    <div
                                                        className={`flex items-center gap-2 ${side === "left" ? "md:justify-end" : "md:justify-start"
                                                            }`}
                                                    >
                                                        <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[10px]">
                                                            👤
                                                        </span>
                                                        <span className="text-zinc-300">{ev.eventHead || "—"}</span>
                                                    </div>

                                                    {ev.venue && (
                                                        <div
                                                            className={`flex items-center gap-2 ${side === "left" ? "md:justify-end" : "md:justify-start"
                                                                }`}
                                                        >
                                                            <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[10px]">
                                                                📍
                                                            </span>
                                                            <span className="text-zinc-300">{ev.venue}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* TIME (desktop only) */}
                                            <div
                                                className={`hidden md:flex flex-col items-center justify-center min-w-[80px] text-zinc-500 ${side === "left" ? "border-r border-white/5 pr-4" : "border-l border-white/5 pl-4"
                                                    }`}
                                            >
                                                <span className="text-xs uppercase tracking-widest mb-1">Time</span>
                                                <span className="font-mono text-lg text-white font-medium">
                                                    {timeLabel(ev)}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-16 pt-8 border-t border-white/5 text-sm text-zinc-500 flex flex-wrap gap-6 justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-white ring-2 ring-black/40" />
                    <span>Event Marker</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-4 rounded border border-white/10 bg-zinc-900/50" />
                    <span>Event Card</span>
                </div>
            </div>
        </section>
    );
}

/* ---------------------------
   Page component
----------------------------*/
export default function SchedulePage() {
    const [activeDay, setActiveDay] = useState<1 | 2>(1);

    return (
        <main className="bg-black text-white min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <ParticleBackground />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto py-12 px-4">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">Event Schedule</h1>
                    <p className="mt-3 text-gray-300 max-w-2xl mx-auto">Two-day schedule — events aligned along a central road for clear chronological flow.</p>

                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={() => setActiveDay(1)}
                            className={`px-6 py-2 rounded-full border transition-all ${activeDay === 1
                                ? "bg-white text-black border-white"
                                : "bg-black text-white border-white/20 hover:border-white/50"
                                }`}
                        >
                            Day 1
                        </button>
                        <button
                            onClick={() => setActiveDay(2)}
                            className={`px-6 py-2 rounded-full border transition-all ${activeDay === 2
                                ? "bg-white text-black border-white"
                                : "bg-black text-white border-white/20 hover:border-white/50"
                                }`}
                        >
                            Day 2
                        </button>
                    </div>
                </header>

                <div key={activeDay} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeDay === 1 ? (
                        <TimelineDay dayLabel="Day 1 — Horizon Fest" events={day1Events.sort((a, b) => a.timeStart.localeCompare(b.timeStart))} />
                    ) : (
                        <TimelineDay dayLabel="Day 2 — Horizon Fest" events={day2Events.sort((a, b) => a.timeStart.localeCompare(b.timeStart))} />
                    )}
                </div>
            </div>
        </main>
    );
}
