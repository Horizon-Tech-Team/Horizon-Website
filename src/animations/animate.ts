import { Variants } from "framer-motion";

/* -------------------------
   SLIDE UP
-------------------------- */
export const SlideUp = (delay: number = 0): Variants => ({
  initial: {
    y: 50,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay,
      ease: "easeOut",
    },
  },
});

/* -------------------------
   SLIDE LEFT
-------------------------- */
export const SlideLeft = (delay: number = 0): Variants => ({
  initial: {
    x: 50,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay,
      ease: "easeOut",
    },
  },
});

/* -------------------------
   FADE IN
-------------------------- */
export const FadeIn = (delay: number = 0): Variants => ({
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.6,
      delay,
      ease: "easeIn",
    },
  },
});

/* -------------------------
   SCALE IN
-------------------------- */
export const ScaleIn = (delay: number = 0): Variants => ({
  initial: {
    scale: 0.85,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay,
      ease: "easeOut",
    },
  },
});
