


// filepath: src/components/one-time/Testimonial.tsx
"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";

export interface Sponsor {
  name: string;
  img: string;
}

/* ---------- Demo Sponsor Data (replace img paths as needed) ---------- */
const marqueeSponsors: Sponsor[] = [
  { name: "Sponsor 1", img: "/logo.jpg" },
  { name: "Sponsor 2", img: "/image.png" },
  { name: "Sponsor 3", img: "/kerelaKitchen.jpg" },
  { name: "Sponsor 4", img: "data:image/jpeg;base64,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" },
];

/* ---------- gold sponsor (single) ---------- */
const goldSponsors: Sponsor[] = [
  {
    name: "Gold Sponsor",
    img: "/warpp-logo-transparent.png",
  },
];

/* ---------- Reusable looping marquee (for top and bottom) ---------- */
function SponsorMarquee({
  sponsors,
  duration = 60,
  direction = "left",
  itemWidth = 260,
  itemHeight = 140,
}: {
  sponsors?: Sponsor[]; // defensive - maybe undefined at runtime
  duration?: number; // seconds for one full loop
  direction?: "left" | "right";
  itemWidth?: number;
  itemHeight?: number;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const controls = useAnimationControls();

  // stable reference for sponsors to avoid changing deps each render
  const validSponsors = useMemo(() => (Array.isArray(sponsors) ? sponsors : []), [sponsors]);

  // Hooks must run unconditionally — do not early-return before hooks.
  useEffect(() => {
    function measure() {
      if (!trackRef.current) return;
      // scrollWidth includes duplication; we duplicated content below, so half it
      const w = Math.max(0, Math.floor(trackRef.current.scrollWidth / 2));
      setTrackWidth(w);
    }
    measure();
    const t = window.setTimeout(measure, 250); // slight delay to let images load
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [validSponsors.length]);

  useEffect(() => {
    if (!trackWidth) return;
    const isLeft = direction === "left";
    controls.start({
      x: isLeft ? [0, -trackWidth] : [-trackWidth, 0],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration,
        ease: "linear",
      },
    });
  }, [controls, trackWidth, duration, direction]);

  // If no sponsors, render nothing (but hooks already ran above)
  if (validSponsors.length === 0) return null;

  // duplicated array for seamless loop
  const items = [...validSponsors, ...validSponsors];

  return (
    <div className="w-full overflow-hidden py-4">
      <motion.div
        ref={trackRef}
        className="flex items-center gap-8"
        style={{ width: "max-content", whiteSpace: "nowrap" }}
        animate={controls}
      >
        {items.map((s, i) => (
          <motion.div
            key={`${s.name}-${i}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: (i % validSponsors.length) * 0.03,
            }}
            className="flex items-center justify-center"
            style={{
              width: itemWidth,
              height: itemHeight,
              flexShrink: 0,
            }}
          >
            <Image
              src={s.img}
              alt={s.name}
              width={itemWidth}
              height={itemHeight}
              className="object-cover w-full h-full rounded-lg"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ---------- Static single gold sponsor (no movement) ---------- */
function StaticGoldSponsor({
  sponsor,
  width = 420,
  height = 220,
}: {
  sponsor?: Sponsor; // defensive
  width?: number;
  height?: number;
}) {
  if (!sponsor) return null;
  return (
    <div className="w-full flex justify-center py-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center"
        style={{ minWidth: width, minHeight: height }}
      >
        <Image
          src={sponsor.img}
          alt={sponsor.name}
          width={width - 32}
          height={height - 32}
          className="object-contain"
        />
      </motion.div>
    </div>
  );
}

/* ---------- Main Sponsors Section (responsive) ---------- */
export default function SponsorsSection() {
  return (
    <section className="w-full bg-black py-12 flex justify-center px-4 relative overflow-hidden">
      <div className="relative w-full max-w-6xl flex flex-col items-center gap-6 z-10">
        {/* side soft fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-black to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-black to-transparent z-20" />

        {/* Title */}
        <motion.h2
          className="text-white text-3xl md:text-4xl font-serif font-bold text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Sponsors
        </motion.h2>

        <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-500 to-transparent" />

        {/* Top marquee: move RIGHT faster */}
        <SponsorMarquee sponsors={marqueeSponsors} duration={20} direction="right" itemWidth={260} itemHeight={140} />

        {/* Middle gold static — big */}
        <StaticGoldSponsor sponsor={goldSponsors[0]} width={420} height={220} />

        {/* Bottom marquee: move LEFT faster */}
        <SponsorMarquee sponsors={marqueeSponsors} duration={10} direction="left" itemWidth={260} itemHeight={140} />
      </div>
    </section>
  );
}
