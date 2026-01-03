"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SlideUp } from "@/animations/animate"
import Link from "next/link"


/* ---------------------------------------------------
   PARTICLES + PERFECT CURSOR-FOLLOW GLOW BACKGROUND
--------------------------------------------------- */
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const glowRef = useRef<HTMLDivElement | null>(null)

  /* ---------------------------
      PARTICLE ANIMATION
  ----------------------------*/
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      speed: Math.random() * 0.3 + 0.15,
      alpha: Math.random() * 0.4 + 0.2,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`
        ctx.fill()

        p.y -= p.speed

        if (p.y < -10) {
          p.y = height + Math.random() * 30
          p.x = Math.random() * width
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  /* ---------------------------
      CURSOR-FOLLOW GLOW
  ----------------------------*/
  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    const size = 700 // glow diameter
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const target = { ...pos }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const moveGlow = () => {
      pos.x = lerp(pos.x, target.x, 0.12)
      pos.y = lerp(pos.y, target.y, 0.12)

      glow.style.transform = `translate(${pos.x - size / 2}px, ${pos.y - size / 2}px)`

      requestAnimationFrame(moveGlow)
    }

    requestAnimationFrame(moveGlow)

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
    }

    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  return (
    <>
      {/* Cursor Glow (centered on cursor always) */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 -z-10 rounded-full blur-[150px]"
        style={{
          width: 700,
          height: 700,
          background: "radial-gradient(circle, rgba(139,92,246,0.35), rgba(59,130,246,0.15), transparent)",
        }}
      />

      {/* Particles Canvas */}
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 w-full h-full -z-20" />
    </>
  )
}

/* ---------------------------------------------------
      COUNTDOWN + VISUAL TIME UNIT BOXES
--------------------------------------------------- */

const TimeUnit = ({ value, label }: { value: number; label: string }) => {
  const padded = value.toString().padStart(2, "0")

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

      <p className="mt-2 text-sm md:text-base text-gray-400 uppercase tracking-wide font-medium">{label}</p>
    </div>
  )
}

const Separator = () => (
  <div className="text-4xl md:text-5xl font-light text-gray-500 select-none hidden md:block">:</div>
)

const CountdownDisplay = ({ onTimerEnd }: { onTimerEnd: () => void }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date("2026-01-06T09:00:00")

    const calc = () => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        onTimerEnd()
      }
    }

    calc()
    const timer = setInterval(calc, 1000)
    return () => clearInterval(timer)
  }, [onTimerEnd])

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
  )
}

/* ---------------------------------------------------
   EVENT STARTED VIEW (Replaces countdown ONLY)
--------------------------------------------------- */
const EventStartedView = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center gap-8 mt-12 relative"
    >
      {/* Animated Tech Rings */}
      <div className="relative flex items-center justify-center w-64 h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-purple-500/30 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute inset-4 border border-blue-500/20 rounded-full border-t-blue-500/60"
        />

        {/* Central Status Node */}
        <div className="relative z-10 flex flex-col items-center justify-center p-8 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.2)]">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="text-[10px] font-mono text-purple-400 mb-1 tracking-widest uppercase"
          >
            System Online
          </motion.div>
          <div className="text-4xl font-black text-white tracking-tighter italic">LIVE</div>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ height: [4, 12, 4] }}
                transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                className="w-1 bg-blue-400 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Floating Data Points */}
        <div className="absolute top-0 -right-12 text-[9px] font-mono text-gray-500 text-left leading-tight hidden sm:block">
  <div>LOC: 19.0236° N, 72.8397° E</div>
  <div>NET: HTTPS</div>
  <div className="text-purple-500/50">STATUS: ONLINE</div>
</div>

<div className="absolute bottom-4 -left-16 text-[9px] font-mono text-gray-500 text-right leading-tight hidden sm:block">
  <div>REFRESH: 60HZ</div>
  <div>TLS: 1.3</div>
  <div className="text-blue-500/50">ENV: PROD</div>
</div>

      </div>

      <Link href="/schedule">
  <motion.button
    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(139,92,246,0.4)" }}
    whileTap={{ scale: 0.98 }}
    className="
      group relative px-10 py-3 overflow-hidden
      bg-white/5 border border-white/10 backdrop-blur-md
      text-white text-xs font-bold uppercase tracking-[0.3em]
      rounded-sm transition-all
    "
  >
    <span className="relative z-10">Initialize Portal</span>
    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
    <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-purple-500" />
    <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-blue-500" />
  </motion.button>
</Link>

    </motion.div>
  )
}

/* ---------- MAIN HERO SECTION (Full Width Background) ---------- */
const Hero: React.FC = () => {
  const [timerEnded, setTimerEnded] = useState(false)

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
                <span>Hello</span>
                <span>Tech</span>
                <span>World!</span>
              </span>

              {/* Line 2 – YEAR */}
              <span
                className="
                  text-transparent bg-clip-text
                  bg-gradient-to-r from-purple-400 to-blue-400
                  text-5xl sm:text-6xl md:text-6xl xl:text-7xl
                  leading-none
                  inline-block
                  pb-1
                "
              >
                2025-26
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
              Step into the world of innovation, coding, and collaboration. Join us for workshops, talks, and hands-on
              experiences that celebrate everything tech — from beginners to pros, everyone says Hello World here.
            </motion.p>
          </div>

          {/* Countdown */}
          <AnimatePresence mode="wait">
            {!timerEnded ? (
              <motion.div
                key="countdown"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
              >
                <CountdownDisplay onTimerEnd={() => setTimerEnded(true)} />
              </motion.div>
            ) : (
              <motion.div key="event-started">
                <EventStartedView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default Hero
