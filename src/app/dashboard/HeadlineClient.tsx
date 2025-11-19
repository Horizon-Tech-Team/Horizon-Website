"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const HeadlineClient = () => {
  return (
    <motion.div
      initial={{ y: "50%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your event registrations and profile
          </p>
        </div>
        <Link href="/events">
          <button className="primary-btn">Browse Events</button>
        </Link>
      </div>
    </motion.div>
  );
};

export default HeadlineClient;
