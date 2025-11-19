"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import Brand1 from "@/assets/brand/1.png";
import Brand2 from "@/assets/brand/2.png";
import Brand3 from "@/assets/brand/3.png";
import Brand4 from "@/assets/brand/4.png";
import Brand5 from "@/assets/brand/5.png";
import { SlideLeft } from "@/animations/animate";

const brands = [
  { src: Brand1, alt: "Brand 1", delay: 0.2 },
  { src: Brand2, alt: "Brand 2", delay: 0.4 },
  { src: Brand3, alt: "Brand 3", delay: 0.6 },
  { src: Brand4, alt: "Brand 4", delay: 0.8 },
  { src: Brand5, alt: "Brand 5", delay: 1.0 },
];

const Brands = () => {
  return (
    <section className="container py-15">
      <div className="flex flex-wrap justify-center lg:justify-between gap-6">
        {brands.map(({ src, alt, delay }, index) => (
          <motion.div
            key={index}
            variants={SlideLeft(delay)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Image
              src={src}
              alt={`${alt} logo`}
              className="w-[110px] md:w-[200px] object-contain"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Brands;

// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";

// import Brand1 from "@/assets/brand/1.png";
// import Brand2 from "@/assets/brand/2.png";
// import Brand3 from "@/assets/brand/3.png";
// import Brand4 from "@/assets/brand/4.png";
// import Brand5 from "@/assets/brand/5.png";
// import { SlideLeft } from "@/animations/animate";

// const brands = [
//   { src: Brand1, alt: "Brand 1", delay: 0.2 },
//   { src: Brand2, alt: "Brand 2", delay: 0.4 },
//   { src: Brand3, alt: "Brand 3", delay: 0.6 },
//   { src: Brand4, alt: "Brand 4", delay: 0.8 },
//   { src: Brand5, alt: "Brand 5", delay: 1.0 },
// ];

// const Brands = () => {
//   const [start, setStart] = useState(false);
//   const containerRef = React.useRef<HTMLDivElement>(null);
//   const scrollerRef = React.useRef<HTMLUListElement>(null);

//   useEffect(() => {
//     addAnimation();
//   }, []);

//   function addAnimation() {
//     if (containerRef.current && scrollerRef.current) {
//       const scrollerContent = Array.from(scrollerRef.current.children);

//       scrollerContent.forEach((item) => {
//         const duplicatedItem = item.cloneNode(true);
//         if (scrollerRef.current) {
//           scrollerRef.current.appendChild(duplicatedItem);
//         }
//       });

//       setStart(true);
//     }
//   }

//   return (
//     <section className="container py-15">
//       <div
//         ref={containerRef}
//         className="overflow-hidden relative"
//         style={{
//           maskImage:
//             "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
//         }}
//       >
//         <ul
//           ref={scrollerRef}
//           className={`flex w-max min-w-full gap-6 py-4 ${
//             start ? "animate-scroll" : ""
//           }`}
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             animation: "scroll 20s linear infinite",
//           }}
//         >
//           {brands.map(({ src, alt, delay }, index) => (
//             <motion.div
//               key={index}
//               variants={SlideLeft(delay)}
//               initial="initial"
//               whileInView="animate"
//               viewport={{ once: true }}
//               className="flex items-center"
//             >
//               <Image
//                 src={src}
//                 alt={`${alt} logo`}
//                 className="w-[110px] md:w-[200px] object-contain"
//               />
//             </motion.div>
//           ))}
//         </ul>
//       </div>
//     </section>
//   );
// };

// export default Brands;
