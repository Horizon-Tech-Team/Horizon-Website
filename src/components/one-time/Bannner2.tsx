"use client";

import React from "react";
import { motion } from "framer-motion";
import { SlideUp } from "@/animations/animate";
import Image from "next/image";

const Banner2 = () => {
  const stats = [
    { value: "2", label: "Days of non-stop tech action" },
    { value: "24+", label: "Events across coding, gaming, and innovation" },
    { value: "500+", label: "Participants from colleges across India" },
  ];

  return (
    <section className="container mx-auto max-w-8xl px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 md:gap-12 items-center">
        {/* TEXT - left */}
        <div className="flex flex-col justify-center items-start text-left px-4 md:px-10">
          <motion.h2
            variants={SlideUp(0.12)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="w-full text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight"
          >
            A Simple Way to Experience Innovation
          </motion.h2>

          <motion.p
  variants={SlideUp(0.28)}
  initial="initial"
  whileInView="animate"
  viewport={{ once: true }}
className="mt-4 text-gray-400 text-[11px] sm:text-[12px] md:text-[12px] leading-relaxed max-w-2xl"
>

            Learn, create, and compete! From coding challenges and logic games
            to hardware-based workshops, Horizon Fest 2025 is designed to spark
            curiosity and celebrate technical excellence.
          </motion.p>

          {/* RESTORED ORIGINAL STATS BLOCK */}
          <motion.div
            variants={SlideUp(0.6)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="flex flex-row justify-center md:justify-start items-center gap-4 px-4 mt-4"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={SlideUp(0.6 + idx * 0.1)}
                className="flex-shrink-0 w-20 md:w-28 text-center"
              >
                <p className="text-2xl md:text-3xl font-bold font-serif leading-none">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-gray-500 leading-tight break-words">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* IMAGE - right */}
        <div className="w-full flex justify-center md:justify-end">
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="w-full"
          >
            {/* Parent with 'relative' and sizing so next/image fill works */}
            <div className="relative w-full max-h-[240px] sm:max-h-[320px] md:max-h-[460px] lg:max-h-[560px] overflow-hidden">
              <div className="w-full max-h-[240px] sm:max-h-[320px] md:max-h-[460px] lg:max-h-[560px] overflow-hidden flex items-center">
                <Image
                  src="/ban1.jpg"
                  alt="Team working together"
                  width={1200} // explicit size keeps it visible
                  height={800}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  style={{
                    objectFit: "contain",
                    objectPosition: "left center",
                  }}
                  priority
                />
              </div>
            </div>

            {/*
              Fallback alternative (uncomment to use explicit width/height instead of fill):
              <div className="w-full max-h-[240px] sm:max-h-[320px] md:max-h-[460px] lg:max-h-[560px] overflow-hidden">
                <Image
                  src="/ban2.jpg"
                  alt="Innovation graphic"
                  width={1200}
                  height={800}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  style={{ objectFit: "contain", objectPosition: "right center" }}
                  priority
                />
              </div>
            */}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner2;
