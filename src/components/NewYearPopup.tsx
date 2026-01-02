"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const NewYearPopup = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("newYearShown");
    if (shown) return;

    setVisible(true);
    sessionStorage.setItem("newYearShown", "true");

    const timer = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] max-w-sm">
      <div className="relative rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 p-[2px] shadow-2xl animate-pop">
        <div className="relative rounded-2xl bg-black/90 px-6 py-5 text-white backdrop-blur-lg">
          <button
            onClick={() => setVisible(false)}
            className="absolute top-3 right-3 text-white/70 hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
            🎉 Happy New Year 2026!
          </h1>

          <p className="mt-2 text-sm md:text-base text-white/90">
            Let’s make <span className="font-semibold">Horizon Fest</span> bigger,
            bolder & unforgettable 🚀
          </p>

          <div className="mt-3 text-xs uppercase tracking-wider text-white/70">
            Team Horizon
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewYearPopup;
