// src/components/one-time/Testimonial.tsx
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
  { name: "Sponsor 4", img: "/smarted.jpg" },
  { name: "Sponsor 5", img: "/pranav.jpg" },
  { name: "Sponsor 6", img: "/sneh.jpeg" },
  { name: "Sponsor 7", img: "/unicorn.jpeg" },
  // { name: "Sponsor 8", img: "https://www.cnet.com/a/img/resize/0e9874cc9d6b18489f832793796d285141496106/hub/2021/10/16/11804578-0dbc-42af-bcd1-3bc7b1394962/the-batman-2022-teaser-poster-batman-01-promo.jpg?auto=webp&fit=bounds&height=900&precrop=1881,1411,x423,y0&width=1200" },
];

/* ---------- gold sponsor (single) ---------- */
const goldSponsors: Sponsor[] = [
  {
    name: "Gold Sponsor",
    img: "/warpp-logo-transparent.png",
  },
];

/* ---------- Responsive SponsorMarquee ---------- */
function SponsorMarquee({
  sponsors,
  duration = 60,
  direction = "left",
  minItemWidth = 140,
  maxItemWidth = 360,
  itemAspect = 16 / 9,
}: {
  sponsors?: Sponsor[];
  duration?: number;
  direction?: "left" | "right";
  minItemWidth?: number;
  maxItemWidth?: number;
  itemAspect?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [itemWidth, setItemWidth] = useState<number>(minItemWidth);
  const controls = useAnimationControls();

  const validSponsors = useMemo(() => (Array.isArray(sponsors) ? sponsors : []), [sponsors]);

  // ---- Hooks run unconditionally (important) ----
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function recompute() {
      const c = containerRef.current;
      if (!c) return;
      const cw = c.clientWidth || 0;

      // decide how many items should be visible at once depending on width
      let targetVisible = 4.5;
      if (cw < 480) targetVisible = 1.5;
      else if (cw < 768) targetVisible = 2.5;
      else if (cw < 1024) targetVisible = 3.5;

      const computed = Math.floor(cw / targetVisible);
      const clamped = Math.max(minItemWidth, Math.min(maxItemWidth, computed));
      setItemWidth(clamped);
    }

    recompute();

    const ro = new ResizeObserver(() => recompute());
    ro.observe(container);
    return () => ro.disconnect();
  }, [minItemWidth, maxItemWidth]);

  useEffect(() => {
    function measure() {
      if (!trackRef.current) return;
      const w = Math.max(0, Math.floor(trackRef.current.scrollWidth / 2));
      if (w) {
        const isLeft = direction === "left";
        controls.start({
          x: isLeft ? [0, -w] : [-w, 0],
          transition: { repeat: Infinity, repeatType: "loop", duration, ease: "linear" },
        });
      }
    }

    // give layout a short moment for images to settle
    const id = window.setTimeout(measure, 80);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", measure);
    };
  }, [itemWidth, duration, direction, controls, validSponsors.length]);

  // ---- now we can early-return safely (hooks already registered) ----
  if (validSponsors.length === 0) {
    return <div ref={containerRef} className="w-full h-10" />; // lightweight placeholder
  }

  const items = [...validSponsors, ...validSponsors];
  const itemHeight = Math.round(itemWidth / itemAspect);

  return (
    <div ref={containerRef} className="w-full overflow-hidden py-4">
      <motion.div
        ref={trackRef}
        className="flex items-center gap-6"
        style={{ width: "max-content", whiteSpace: "nowrap" }}
        animate={controls}
      >
        {items.map((s, i) => (
          <div
            key={`${s.name}-${i}`}
            className="flex items-center justify-center rounded-lg bg-white/3 shadow-sm"
            style={{ width: itemWidth, height: itemHeight, flexShrink: 0 }}
          >
            <div className="relative w-full h-full p-2">
              <Image
                src={s.img}
                alt={s.name}
                fill
                sizes={`(max-width: 640px) ${Math.max(120, Math.floor(itemWidth * 0.9))}px, (max-width: 1024px) ${Math.floor(
                  itemWidth * 0.9,
                )}px, ${itemWidth}px`}
                style={{ objectFit: "contain" }}
                priority={false}
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ---------- StaticGoldSponsor (responsive) ---------- */
function StaticGoldSponsor({ sponsor }: { sponsor?: Sponsor }) {
  if (!sponsor) return null;
  return (
    <div className="w-full flex justify-center py-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[480px] sm:max-w-[620px] md:max-w-[760px] px-4"
      >
        <div className="relative w-full h-36 sm:h-44 md:h-56">
          <Image src={sponsor.img} alt={sponsor.name} fill style={{ objectFit: "contain" }} priority />
        </div>
      </motion.div>
    </div>
  );
}



/* ---------- Main Sponsors Section (responsive) ---------- */
export default function SponsorsSection() {
  return (
    <section className="w-full bg-black py-12 flex justify-center px-4 relative overflow-hidden">
      <div className="relative w-full max-w-6xl flex flex-col items-center gap-6 z-10">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-12 sm:w-20 bg-gradient-to-r from-black to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 sm:w-20 bg-gradient-to-l from-black to-transparent z-20" />

        <motion.h2
          className="text-white text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Sponsors
        </motion.h2>

        <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-500 to-transparent" />

        {/* Top marquee: move RIGHT faster */}
        <SponsorMarquee sponsors={marqueeSponsors} duration={22} direction="right" />

        {/* Middle gold static — big */}
        <StaticGoldSponsor sponsor={goldSponsors[0]} />

        {/* Bottom marquee: move LEFT faster */}
        <SponsorMarquee sponsors={marqueeSponsors} duration={12} direction="left" />
      </div>
    </section>
  );
}
