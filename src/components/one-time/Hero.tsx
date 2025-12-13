"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SlideUp } from "@/animations/animate";
import { TextAnimate } from "../magicui/text-animate";

/* ---------------------------------------------------
   PARTICLES + PERFECT CURSOR-FOLLOW GLOW BACKGROUND
--------------------------------------------------- */
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  /* ---------------------------
      PARTICLE ANIMATION
  ----------------------------*/
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      speed: Math.random() * 0.3 + 0.15,
      alpha: Math.random() * 0.4 + 0.2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();

        p.y -= p.speed;

        if (p.y < -10) {
          p.y = height + Math.random() * 30;
          p.x = Math.random() * width;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------------------------
      CURSOR-FOLLOW GLOW
  ----------------------------*/
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const size = 700; // glow diameter
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const moveGlow = () => {
      pos.x = lerp(pos.x, target.x, 0.12);
      pos.y = lerp(pos.y, target.y, 0.12);

      glow.style.transform = `translate(${pos.x - size / 2}px, ${
        pos.y - size / 2
      }px)`;

      requestAnimationFrame(moveGlow);
    };

    requestAnimationFrame(moveGlow);

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <>
      {/* Cursor Glow (centered on cursor always) */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 -z-10 rounded-full blur-[150px]"
        style={{
          width: 700,
          height: 700,
          background:
            "radial-gradient(circle, rgba(139,92,246,0.35), rgba(59,130,246,0.15), transparent)",
        }}
      />

      {/* Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 w-full h-full -z-20"
      />
    </>
  );
};

/* ---------------------------------------------------
      COUNTDOWN + VISUAL TIME UNIT BOXES
--------------------------------------------------- */

const TimeUnit = ({ value, label }: { value: number; label: string }) => {
  const padded = value.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={padded}
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="
          w-20 h-20 md:w-28 md:h-28 
          flex items-center justify-center 
          rounded-xl md:rounded-2xl
          bg-gradient-to-br from-white/10 to-white/5 
          backdrop-blur-md
          border border-white/10
          text-3xl md:text-5xl font-bold text-white
        "
      >
        {padded}
      </motion.div>

      <p className="mt-2 text-sm md:text-base text-gray-400 uppercase tracking-wide font-medium">
        {label}
      </p>
    </div>
  );
};

const Separator = () => (
  <div className="text-4xl md:text-5xl font-light text-gray-500 select-none hidden md:block">
    :
  </div>
);

const CountdownDisplay = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-01-06T00:00:00");

    const calc = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, ease: "easeOut" }}
  viewport={{ once: true }}
  className="
    flex flex-nowrap
    justify-center items-center
    gap-2 sm:gap-3 md:gap-6
    mt-10
    overflow-x-auto
  "
>
  <TimeUnit value={timeLeft.days} label="Days" />
  <Separator />
  <TimeUnit value={timeLeft.hours} label="Hours" />
  <Separator />
  <TimeUnit value={timeLeft.minutes} label="Minutes" />
  <Separator />
  <TimeUnit value={timeLeft.seconds} label="Seconds" />
</motion.div>

  );
};

/* ---------- MAIN HERO SECTION (Full Width Background) ---------- */
const Hero: React.FC = () => {
  return (
    <section
      className="
        relative w-screen min-h-[100vh]
        flex flex-col items-center justify-center
        overflow-hidden
        py-20
      "
    >
      {/* FULLSCREEN PARTICLE BACKGROUND */}
      <ParticleBackground />

      {/* FULLSCREEN BLUR GLOW AMBIENCE */}
      <div className="absolute inset-0 w-full h-full bg-black pointer-events-none -z-30">
        <div className="absolute top-0 left-1/4 w-[35rem] h-[35rem] bg-purple-900/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-[35rem] h-[35rem] bg-blue-900/20 rounded-full blur-[128px]" />
      </div>

      {/* CONTENT WRAPPER (Centered, NOT limiting background size) */}
      <div className="relative z-10 w-full max-w-5xl px-4 mx-auto">
        <div className="flex flex-col items-center text-center gap-12">
          {/* Heading */}
          <div className="flex flex-col justify-center gap-7 items-center max-w-4xl mx-auto">
            <motion.h1
  variants={SlideUp(0.2)}
  initial="initial"
  whileInView="animate"
  viewport={{ once: true }}
  className="
    font-serif font-bold tracking-tight
    text-4xl sm:text-5xl md:text-6xl xl:text-7xl
    leading-tight
    text-center
    flex flex-col
    items-center justify-center
    gap-y-2
  "
>
  {/* Line 1 */}
  <span className="flex flex-col md:flex-row gap-x-4">
    <span>HELLO</span>
    <span>TECH</span>
    <span>WORLD</span>
  </span>

  {/* Line 2 – YEAR */}
  <span
    className="
      text-transparent bg-clip-text
      bg-gradient-to-r from-purple-400 to-blue-400
      text-5xl sm:text-6xl md:text-6xl xl:text-7xl
      mt-1
    "
  >
    2025
  </span>
</motion.h1>



            <motion.h2
              variants={SlideUp(0.5)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold font-serif tracking-tight leading-8 mx-auto max-w-2xl text-center"
            >
              The Evolution of Technology
            </motion.h2>

            <motion.p
              variants={SlideUp(0.5)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-lg md:text-lg text-gray-400 leading-8 max-w-2xl text-center"
            >
              Step into the world of innovation, coding, and collaboration. Join
              us for workshops, talks, and hands-on experiences that celebrate
              everything tech — from beginners to pros, everyone says Hello
              World here.
            </motion.p>
          </div>

          {/* Countdown */}
          <CountdownDisplay />
        </div>
      </div>
    </section>
  );
};

export default Hero;
