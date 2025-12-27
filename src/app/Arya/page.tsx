"use client";

import Image from "next/image";

const items = [
  { type: "video", src: "/50shadesofarya/arya.mp4" },
  { type: "image", src: "/50shadesofarya/arya1.jpeg" },
  { type: "image", src: "/50shadesofarya/arya2.jpeg" },
  { type: "image", src: "/50shadesofarya/arya3.jpeg" },
  { type: "image", src: "/50shadesofarya/arya4.jpeg" },
  { type: "image", src: "/50shadesofarya/arya5.jpeg" },
  { type: "image", src: "/50shadesofarya/arya6.jpeg" },
];

export default function CollagePage() {
  return (
    <div className="min-h-screen bg-black px-3 py-4">
      <div
        className="
          columns-1
          sm:columns-2
          lg:columns-3
          gap-4
          space-y-4
        "
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="break-inside-avoid overflow-hidden rounded-lg"
          >
            {item.type === "video" ? (
              <video
                src={item.src}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto object-cover rounded-lg"
              />
            ) : (
              <Image
                src={item.src}
                alt={`Arya ${i}`}
                width={1000}
                height={1500}
                className="w-full h-auto object-cover rounded-lg"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
