"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface LoadingLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  text?: string;
  className?: string;
}

export default function LoadingLogo({
  size = "md",
  showText = true,
  text = "Loading...",
  className,
}: LoadingLogoProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      {/* Logo Container with Animations */}
      <div className="relative">
        {/* Outer Spinning Ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/30 animate-spin",
            sizeClasses[size]
          )}
        />

        {/* Inner Pulsing Ring */}
        <div
          className={cn(
            "absolute inset-2 rounded-full border-2 border-primary/20 animate-pulse",
            size === "sm"
              ? "inset-1"
              : size === "lg"
              ? "inset-3"
              : size === "xl"
              ? "inset-4"
              : "inset-2"
          )}
        />

        {/* Logo Image */}
        <div
          className={cn(
            "relative rounded-full bg-gradient-to-br from-primary/10 to-primary/5 p-3 backdrop-blur-sm",
            sizeClasses[size]
          )}
        >
          <Image
            src='/logo.png'
            width={100}
            height={100}
            alt="Horizon Tech Fest Logo"
            className="w-full h-full object-contain animate-pulse"
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute -inset-4 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-1 h-1 bg-primary/40 rounded-full animate-ping",
                i === 0 && "top-0 left-1/2 animation-delay-0",
                i === 1 && "top-1/4 right-0 animation-delay-200",
                i === 2 && "bottom-1/4 right-0 animation-delay-400",
                i === 3 && "bottom-0 left-1/2 animation-delay-600",
                i === 4 && "bottom-1/4 left-0 animation-delay-800",
                i === 5 && "top-1/4 left-0 animation-delay-1000"
              )}
              style={{
                animationDelay: `${i * 200}ms`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading Text */}
      {showText && (
        <div className="text-center space-y-2">
          <p
            className={cn(
              "font-medium text-foreground/80 animate-pulse",
              textSizes[size]
            )}
          >
            {text}
          </p>

          {/* Animated Dots */}
          <div className="flex justify-center gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
