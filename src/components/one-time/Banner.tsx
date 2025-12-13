// src/components/one-time/Banner.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

const Card = ({
  title,
  desc,
  delay,
  className,
}: {
  title: string;
  desc: string;
  delay: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    whileHover={{ scale: 1.02 }}
    className={`
      relative overflow-hidden rounded-3xl
      border border-white/10
      bg-white/5 backdrop-blur-md
      p-8
      transition-all duration-300
      hover:bg-white/10 hover:border-white/20
      ${className}
    `}
  >
    <h3 className="text-2xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60 mb-3">
      {title}
    </h3>

    <p className="text-sm text-gray-400 leading-relaxed font-light">
      {desc}
    </p>
  </motion.div>
);


export default function Banner() {
  return (
    <section className="relative w-screen min-h-[80vh] flex items-center justify-center py-20 overflow-hidden">

      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[128px] pointer-events-none" />

      <div className="container px-6 mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left: Text Content */}
        <div className="space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold font-serif leading-tight tracking-tighter">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-white">
                SHAPING THE
              </span>
              <span className="block text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                FUTURE
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-6 mx-auto lg:mx-0" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-gray-400 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 font-light"
          >
            Horizon Tech Fest is where visionaries collide. Experience a convergence
            of code, creativity, and culture designed to propel you into the next
            generation of innovation.
          </motion.p>
        </div>

        {/* Right: Bento Grid of Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full min-h-[400px]">
          {/* Card 1: Large Vertical */}
          <Card
            title="INNOVATE"
            desc="Break boundaries with cutting-edge workshops and hackathons designed to challenge your limits."
            delay={0.2}
            className="md:row-span-2 md:h-full bg-gradient-to-b from-blue-900/10 to-transparent"
          />

          {/* Card 2: Top Right */}
          <Card
            title="COLLABORATE"
            desc="Connect with industry leaders and like-minded peers in an ecosystem built for growth."
            delay={0.4}
            className="bg-gradient-to-bl from-purple-900/10 to-transparent"
          />

          {/* Card 3: Bottom Right */}
          <Card
            title="INSPIRE"
            desc="Witness the future unfold through keynote sessions and interactive demos."
            delay={0.6}
            className="bg-gradient-to-tr from-cyan-900/10 to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
