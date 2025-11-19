"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface TestimonialItem {
  id: number;
  name: string;
  designation: string;
  img: string;
  text: string;
}

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: TestimonialItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-[1290px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((card) => (
          <li
            key={card.id}
            className="relative w-[350px] max-w-full shrink-0 rounded-lg border border-gray-500 px-5 py-10 text-white bg-black group hover:bg-white duration-300 md:w-[450px]"
          >
            {/* Upper section */}
            <div className="flex flex-row items-center gap-3">
              <Image
                src={card.img}
                alt={`Profile of ${card.name}, ${card.designation}`}
                className="rounded-full"
                width={60}
                height={60}
              />
              <div>
                <p className="text-sm font-bold group-hover:text-black">
                  {card.name}
                </p>
                <p className="text-gray-400 text-xs group-hover:text-black">
                  {card.designation}
                </p>
              </div>
            </div>

            {/* Bottom section */}
            <div className="mt-5 border-t-2 border-gray-500/40 pt-5">
              <p className="text-sm text-gray-300 group-hover:text-black duration-300">
                {card.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
