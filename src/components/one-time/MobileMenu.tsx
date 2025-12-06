/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuroraText } from "../magicui/aurora-text";
import { NumberTicker } from "../magicui/number-ticker";
import Image from "next/image";
import logo from "@/assets/logo.png";

export default function MobileMenu({
  
}: {
  user: any;
  logout: () => void;
  isSubmitting: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lgBreakpoint = getComputedStyle(document.documentElement)
      .getPropertyValue("--tw-screen-lg")
      .trim();
    const handleResize = () => {
      if (window.innerWidth > parseInt(lgBreakpoint)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <nav aria-label="Mobile Navigation" className="md:hidden">
      {/* Menu Button */}
      <Button
        size="icon"
        variant="ghost"
        className="inline-flex"
        aria-label="Open Mobile Menu"
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon style={{ width: "25px", height: "25px" }} />
      </Button>

      {/* Mobile Drawer Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-4/5 h-screen">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold flex items-center gap-2.5 justify-center">
              <Image src={logo} alt="Horizon logo" width={35} height={35} />
              <div>
                <span> Horizon</span>{" "}
                <AuroraText>
                  <NumberTicker
                    startValue={2000}
                    value={2025}
                    className="whitespace-pre-wrap pt-1 text-xl font-bold tracking-tighter text-black dark:text-white"
                  />
                </AuroraText>{" "}
              </div>
            </SheetTitle>
          </SheetHeader>

          {/* Content */}
          <div className="py-8 flex flex-col space-y-5 items-start">
            {/* Search */}
            {/* <div className="w-full px-4">
              <SearchField className="w-full p-2 rounded-md" />
            </div> */}

            <Separator />

            {/* Navigation Links */}
            <ul className="space-y-6 px-6">
              <li>
                <Link
                  href="/"
                  className="block text-lg font-semibold transition-all"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block text-lg font-semibold transition-all"
                >
                  About Us
                </Link>
              </li>
                    <li>
                <Link
                  href="/events"
                  className="block text-lg font-semibold transition-all"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/sponsors"
                  className="block text-lg font-semibold transition-all"
                >
                  Sponsors
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block text-lg font-semibold transition-all"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback"
                  className="block text-lg font-semibold transition-all"
                >
                  Feedback
                </Link>
              </li>
            </ul>
            {/* <Separator />
            {user && (
              <ul className="space-y-6 px-6">
                <li>
                  {user.role !== "admin_helper" && (
                    <Link
                      href={
                        user.role === "contingent_leader"
                          ? "/dashboard/cl"
                          : "/dashboard"
                      }
                      className="block text-lg font-semibold transition-all"
                    >
                      Dashboard
                    </Link>
                  )}
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="block text-lg font-semibold transition-all"
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            )} */}
            {/* {user && <Separator />} */}
          </div>

          {/* <div className="py-4 px-6 w-full">
            {user ? (
              <button
                className="primary-btn w-full"
                disabled={isSubmitting}
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <Link href="/register" className="w-full">
                <button className="primary-btn w-full">Register Now</button>
              </Link>
            )}
          </div> */}
        </SheetContent>
      </Sheet>
    </nav>
  );
}
