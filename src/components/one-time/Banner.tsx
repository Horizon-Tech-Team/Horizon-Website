// Banner.jsx (fixed)
"use client";

import React from "react";
import { motion } from "framer-motion";
import { SlideUp } from "@/animations/animate";
import Image from "next/image";

const Banner = () => {
  return (
    <section className="container mx-auto max-w-8xl px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 md:gap-12 items-center">
        
        {/* IMAGE container: capped heights */}
        <div className="w-full flex justify-center md:justify-start">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative w-full"
          >
            <div className="w-full max-h-[240px] sm:max-h-[320px] md:max-h-[460px] lg:max-h-[560px] overflow-hidden flex items-center">
              
              {/* FIXED: next/image with explicit sizes */}
              <Image
                src="/ban1.jpg"
                alt="Team working together"
                width={1200}
                height={800}
                className="w-full h-auto max-h-full object-contain"
                priority
              />

            </div>
          </motion.div>
        </div>

        {/* TEXT - right */}
        <div className="flex flex-col justify-center items-start text-left px-4 md:px-10">
          <motion.h2
            variants={SlideUp(0.12)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="w-full text-2xl sm:text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold font-serif leading-tight"
          >
            Together, We Build the Future of Technology
          </motion.h2>

          <motion.p
            variants={SlideUp(0.28)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mt-4 text-gray-400 text-xs sm:text-xs md:text-[13px] leading-relaxed max-w-2xl"
          >
            Horizon Fest 2025 is powered by a dynamic team of organizers, innovators, and tech
            enthusiasts who believe that great ideas come alive through teamwork. Our mission is to
            create a space where creativity meets technology — turning inspiration into innovation.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default Banner;
