// "use client";

// import React, { useRef } from "react";
// import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
// import { SlideUp } from "@/animations/animate";

// const Banner2 = () => {
//   return (
//     <section className="relative w-full overflow-hidden py-24 md:py-32">
//       {/* Deep background ambience */}
//       <div className="absolute inset-0 -z-10">
//         <div className="absolute top-1/3 left-1/4 w-[40rem] h-[40rem]" />
//         <div className="absolute bottom-1/3 right-1/4 w-[40rem] h-[40rem]" />
//       </div>

//       <div className="container mx-auto max-w-7xl px-6">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

//           {/* LEFT — TEXT (layout preserved) */}
//           <div className="relative">
//             <motion.h2
//               variants={SlideUp(0.1)}
//               initial="initial"
//               whileInView="animate"
//               viewport={{ once: true }}
//               className="text-3xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight"
//             >
//               Engineering
//               <br />
//               Experiences,
//               <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
//                 Not Just Events
//               </span>
//             </motion.h2>

//             <motion.p
//               variants={SlideUp(0.25)}
//               initial="initial"
//               whileInView="animate"
//               viewport={{ once: true }}
//               className="mt-6 text-gray-400 text-sm md:text-base max-w-xl leading-relaxed"
//             >
//               Horizon Fest isn’t a schedule — it’s a system.
//               A living network of ideas, challenges, and minds
//               synchronizing over two days of high-intensity innovation.
//             </motion.p>
//           </div>

//           <TiltCard />
//         </div>
//       </div>
//     </section>
//   );
// };

// const TiltCard = () => {
//   const ref = useRef<HTMLDivElement>(null);

//   const x = useMotionValue(0);
//   const y = useMotionValue(0);

//   const mouseXSpring = useSpring(x);
//   const mouseYSpring = useSpring(y);

//   const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
//   const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!ref.current) return;

//     const rect = ref.current.getBoundingClientRect();

//     const width = rect.width;
//     const height = rect.height;

//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;

//     const xPct = mouseX / width - 0.5;
//     const yPct = mouseY / height - 0.5;

//     x.set(xPct);
//     y.set(yPct);
//   };

//   const handleMouseLeave = () => {
//     x.set(0);
//     y.set(0);
//   };

//   return (
//     <motion.div
//       ref={ref}
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       style={{
//         rotateX,
//         rotateY,
//         transformStyle: "preserve-3d",
//       }}
//       className="relative w-full h-[500px] flex items-center justify-center cursor-pointer group"
//     >
//       {/* 3D FLOATING LAYERS */}

//       {/* Layer 1: Base Glow */}
//       <div
//         style={{ transform: "translateZ(50px)" }}
//         className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"
//       />

//       {/* Layer 2: Main Card Glass */}
//       <div
//         style={{ transform: "translateZ(75px)" }}
//         className="
//           absolute inset-4 
//           rounded-2xl 
//           bg-black/40 backdrop-blur-xl 
//           border border-white/10
//           shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]
//         "
//       >
//         <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
//       </div>

//       {/* Layer 3: Central Visual Elements that pop out */}
//       <div
//         style={{ transform: "translateZ(120px)" }}
//         className="relative flex items-center justify-center"
//       >
//         {/* Outer Ring */}
//         <div className="w-64 h-64 md:w-80 md:h-80 border border-white/20 rounded-full animate-[spin_10s_linear_infinite]" />

//         {/* Inner Dashed Ring */}
//         <div className="absolute w-48 h-48 md:w-60 md:h-60 border border-dashed border-purple-400/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

//         {/* Core */}
//         <div className="absolute w-24 h-24 md:w-32 md:h-32 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full blur-md animate-pulse" />

//         {/* Text */}
//         <div className="absolute z-10 text-center">
//           <h3 className="text-3xl font-bold text-white tracking-widest drop-shadow-lg">CORE</h3>
//           <p className="text-[10px] text-purple-200 uppercase tracking-widest mt-1">System Active</p>
//         </div>
//       </div>

//       {/* Layer 4: Floating UI Bits */}
//       <div
//         style={{ transform: "translateZ(150px)" }}
//         className="absolute top-12 right-12 w-16 h-1 bg-white/20 rounded-full"
//       />
//       <div
//         style={{ transform: "translateZ(150px)" }}
//         className="absolute bottom-12 left-12 w-16 h-1 bg-purple-500/50 rounded-full"
//       />

//       {/* Layer 5: Reflections */}
//       <motion.div
//         style={{
//           transform: "translateZ(80px)",
//           background: useMotionTemplate`
//             radial-gradient(
//               circle at ${mouseXSpring.get() * 100 + 50}% ${mouseYSpring.get() * 100 + 50}%,
//               rgba(255,255,255,0.1),
//               transparent 80%
//             )
//           `,
//         }}
//         className="absolute inset-4 rounded-2xl pointer-events-none"
//       />

//     </motion.div>
//   );
// };

// export default Banner2;



"use client";

import React from "react";
import { motion } from "framer-motion";
import { SlideUp } from "@/animations/animate";
import Image from "next/image";

const Banner2 = () => {
  const stats = [
    { value: "2", label: "Days of non-stop tech action" },
    { value: "20+", label: "Events across coding and innovation" },
    { value: "500+", label: "Participants from colleges across Mumbai" },
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
