"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";

export interface Sponsor {
  name: string;
  img: string;
}

const marqueeSponsors: Sponsor[] = [
  { name: "Sponsor 1", img: "/logo.jpg" },
  { name: "Sponsor 2", img: "/image.png" },
  { name: "Sponsor 3", img: "/kerelaKitchen.jpg" },
  { name: "Sponsor 4", img: "/smarted.jpg" },
];

const goldSponsors: Sponsor[] = [
  { name: "Gold Sponsor", img: "/warpp-logo-transparent.png" },
];

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
  const [itemWidth, setItemWidth] = useState(minItemWidth);
  const controls = useAnimationControls();

  const validSponsors = useMemo(() => (Array.isArray(sponsors) ? sponsors : []), [sponsors]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function recompute() {
      const c = containerRef.current;
      if (!c) return;
      const cw = c.clientWidth || 0;

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
      if (w && validSponsors.length > 0) {
        const isLeft = direction === "left";
        controls.start({
          x: isLeft ? [0, -w] : [-w, 0],
          transition: { repeat: Infinity, repeatType: "loop", duration, ease: "linear" },
        });
      }
    }

    const id = window.setTimeout(measure, 80);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", measure);
    };
  }, [itemWidth, duration, direction, controls, validSponsors.length]);

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
            <div className="relative w-full h-full">
              <Image
                src={s.img}
                alt={s.name}
                fill
                sizes={`(max-width: 640px) ${Math.max(
                  120,
                  Math.floor(itemWidth * 0.9)
                )}px, (max-width: 1024px) ${Math.floor(
                  itemWidth * 0.9
                )}px, ${itemWidth}px`}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

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
          <Image src={sponsor.img} alt={sponsor.name} fill style={{ objectFit: "contain" }} />
        </div>
      </motion.div>
    </div>
  );
}

function EventStats() {
  const stats = [
    { value: "2", label: "Days of non-stop tech action" },
    { value: "24+", label: "Events across coding, gaming, and innovation" },
    { value: "500+", label: "Participants from colleges across India" },
  ];

  return (
    <div className="w-full py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white">
                {s.value}
              </div>
              <div className="mt-2 text-sm sm:text-base text-gray-300 max-w-xs">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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

        <EventStats />

        <SponsorMarquee sponsors={marqueeSponsors} duration={22} direction="right" />

        <StaticGoldSponsor sponsor={goldSponsors[0]} />

        <SponsorMarquee sponsors={marqueeSponsors} duration={12} direction="left" />
      </div>
    </section>
  );
}
