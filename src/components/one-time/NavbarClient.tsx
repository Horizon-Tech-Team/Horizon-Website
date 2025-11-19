"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import { NumberTicker } from "../magicui/number-ticker";
import { AuroraText } from "../magicui/aurora-text";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/app/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const NavLinks = [
  { id: 1, title: "Events", link: "events" },
  { id: 2, title: "About", link: "about" },
  { id: 3, title: "Leaderboard", link: "leaderboard" },
  { id: 4, title: "Contact", link: "contact" },
];

const NavbarClient = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/logout", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        setUser(null);
        setIsSubmitting(false);
        router.refresh(); // Refresh server component state
      } else {
        console.error("Logout failed");
        setIsSubmitting(false);
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error("Error during logout:", err);
    }
  };

  const getUserInitials = () => {
    const first = user?.firstName || "";
    const last = user?.lastName || "";
    const initials = `${first.charAt(0)}${last.charAt(0)}`;
    return initials.toUpperCase() || "U";
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="container mx-auto py-6 flex justify-between items-center px-4 lg:px-0 relative z-10"
    >
      {/* Logo section */}
      <div className="flex items-center gap-3">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src={logo} alt="Interior logo" width={40} height={40} />
            <div className="flex items-center gap-1 justify-center">
              <span className="text-2xl font-bold">Horizon</span>
              <div className="flex items-center">
                <AuroraText>
                  <NumberTicker
                    startValue={2000}
                    value={2025}
                    className="whitespace-pre-wrap pt-1 text-xl font-bold tracking-tighter text-black dark:text-white"
                  />
                </AuroraText>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation links */}
      <div className="hidden md:flex space-x-12">
        {NavLinks.map((link) => (
          <Link key={link.id} href={`/${link.link}`}>
            <span className="text-lg font-semibold hover:text-gray-600 transition-colors duration-200">
              {link.title}
            </span>
          </Link>
        ))}
      </div>

      <MobileMenu
        user={user}
        logout={handleLogout}
        isSubmitting={isSubmitting}
      />

      {/* Call to Action button */}
      <div className="hidden md:flex">
        {user ? (
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-[45px] w-[45px] cursor-pointer border-1 border-muted-foreground">
                  <AvatarImage src={user?.avatar || ""} alt="User avatar" />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-50" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {user.role !== "admin_helper" &&
                  user.role !== "public_relation" && (
                    <Link
                      href={
                        user.role === "contingent_leader"
                          ? "/dashboard/cl"
                          : user.role === "superadmin"
                          ? "/admin"
                          : "/dashboard"
                      }
                      className="cursor-pointer"
                    >
                      <DropdownMenuItem>Dashboard</DropdownMenuItem>
                    </Link>
                  )}
                <Link href="/profile" className="cursor-pointer">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <button
                    disabled={isSubmitting}
                    onClick={handleLogout}
                    className="font-semibold"
                  >
                    Logout
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link href="/register">
            <button className="primary-btn uppercase bg-black text-white shadow-[5px_5px_0px_0px_#6c6c6c]">
              Register Now
            </button>
          </Link>
        )}
      </div>
    </motion.nav>
  );
};

export default NavbarClient;
