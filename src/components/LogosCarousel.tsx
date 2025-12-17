import React from "react";

export const LogosCarousel: React.FC = () => {
  const logoModules = import.meta.glob("/src/logos/*.{png,jpg,jpeg,svg}", {
    eager: true,
  });

  // Zamiana obiektów na ścieżki URL
  const logos = Object.values(logoModules).map((mod: any) => mod.default);

  // Powielamy, aby zrobić płynną karuzelę
  const scrollingLogos = [...logos, ...logos];

  return (
    <div className="w-full overflow-hidden py-8 bg-white select-none">
      <div className="flex gap-12 animate-scroll-infinite">
        {scrollingLogos.map((src: string, index: number) => (
          <img
            key={index}
            src={src}
            alt="Logo firmy"
            className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition"
          />
        ))}
      </div>
    </div>
  );
};
