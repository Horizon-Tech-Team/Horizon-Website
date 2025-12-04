"use client";

import React from "react";
// import banner1 from "../../public/ban1.jpg";
import { motion } from "framer-motion";
import { SlideUp } from "@/animations/animate";
import Image from "next/image";

const Banner = () => {
  return (
    <section className="container py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center place-items-center md:place-items-start">
        {/* Image section */}
        <div className="flex justify-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Image
              src={"/ban1.jpg"}
              alt="Team working together"
              className="w-[95%] md:w-full mx-auto"
              width={800}
              height={750}
            />
          </motion.div>
        </div>

        {/* Text section */}
        <div className="space-y-5 xl:max-w-[500px] text-center md:text-left">
          <motion.h2
            variants={SlideUp(0.2)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-4xl font-bold font-serif"
          >
            Together, We Build the Future of Technology
          </motion.h2>
          <motion.p
            variants={SlideUp(0.4)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-gray-500 text-sm leading-7"
          >
            Horizon Fest 2025 is powered by a dynamic team of organizers, innovators, and tech
            enthusiasts who believe that great ideas come alive through teamwork.
            Our mission is to create a space where creativity meets technology — turning inspiration
            into innovation.
          </motion.p>
          {/* <motion.button
            variants={SlideUp(0.6)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="primary-btn bg-black text-white shadow-[5px_5px_0px_0px_#6c6c6c]"
          >
            Discover Now
          </motion.button> */}
        </div>
      </div>
    </section>
  );
};

export default Banner;
