// src/components/one-time/Hero.tsx
"use client";

import React from "react";
import Image from "next/image";
import HeroPng from "@/assets/hero.png";
import { motion } from "framer-motion";
import { SlideUp } from "@/animations/animate";
import { TextAnimate } from "../magicui/text-animate";

const Hero: React.FC = () => {
  return (
    <section className="pb-0 pt-0">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[600px] gap-10 items-center">
          {/* Text Section */}
          <div className="flex flex-col justify-center gap-7 md:pr-8 xl:pr-52 text-center md:text-left px-6 md:px-0">
            <motion.h1
              variants={SlideUp(0.2)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-5xl font-bold font-serif"
            >
              <TextAnimate animation="blurInUp" by="character" duration={1}>HELLO</TextAnimate>
              <TextAnimate animation="blurInUp" by="character" duration={1}>TECH</TextAnimate>
              <TextAnimate animation="blurInUp" by="character" duration={1}>WORLD</TextAnimate>
              <TextAnimate animation="blurInUp" by="character" duration={1}>2025</TextAnimate>
            </motion.h1>

            <motion.p variants={SlideUp(0.5)} initial="initial" whileInView="animate" viewport={{ once: true }} className="text-sm md:text-base text-gray-500 leading-7">
              Step into the world of innovation, coding, and collaboration. Join
              us for workshops, talks, and hands-on experiences that celebrate
              everything tech — from beginners to pros, everyone says Hello World here.
            </motion.p>
          </div>

          {/* Image Section */}
          <motion.div initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} viewport={{ once: true }} className="flex justify-center">
            <Image src={HeroPng} alt="Hello World Tech Fest 2025 illustration" className="w-[80%] md:w-[700px] object-cover" priority />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
