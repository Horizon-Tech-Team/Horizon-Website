"use client";

import React, { useEffect, useRef } from "react";

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

            glow.style.transform = `translate(${pos.x - size / 2}px, ${pos.y - size / 2
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

export default ParticleBackground;
