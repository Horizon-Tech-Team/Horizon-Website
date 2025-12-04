"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo.png";
import { FaPhone } from "react-icons/fa6";
import { LuMessageSquare } from "react-icons/lu";
import { motion } from "framer-motion";
import { SlideUp } from "@/animations/animate";

const Footer = () => {
  return (
    <motion.footer
      variants={SlideUp(0.2)}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className=""
    >
      <div className="container mx-auto py-11 px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4 font-semibold">
            <div className="flex items-center space-x-3">
              <Image src={Logo} alt="Interior logo" width={24} height={24} />
              <p className="text-xl font-semibold">Horizon 2025</p>
            </div>
            <p>Mumbai, Maharashtra, India</p>
            <p>© 2025 TCJ. All rights reserved.</p>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">About Us</h2>
              <ul className="text-sm space-y-4">
                <li>
                  <Link href="/">Our Story</Link>
                </li>
                <li>
                  <Link href="/">Info</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Support</h2>
              <ul className="text-sm space-y-4">
                <li>
                  <Link href="/contact#FAQ">FAQ&apos;s</Link>
                </li>
                <li>
                  <Link href="/sponsors">Sponsors</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Us</h2>
            <ul className="text-base font-semibold space-y-4">
              <li className="flex items-center space-x-3">
                <FaPhone />
                <a href="tel:+918097670761">+91 8097670761</a>
              </li>
              <li className="flex items-center space-x-3">
                <LuMessageSquare />
                <a href="mailto:techteam.horizon@gmail.com">
                  techteam.horizon@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Notice */}
        <p className="text-center text-sm font-semibold border-t-2 pt-5 mt-5">
          &copy; 2025 Horizon Fest. Developed by the Technical Team. All Rights Reserved.

        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
