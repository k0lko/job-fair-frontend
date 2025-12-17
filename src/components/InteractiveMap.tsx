import { useEffect, useRef } from "react";
import { useBoothStore } from "../store/boothStore";
import MapSvg from "../assets/Mapa.svg?raw";

export const InteractiveMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { getBoothByNumber, setSelectedBooth, setModalOpen } = useBoothStore();

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = MapSvg;

    const booths = containerRef.current.querySelectorAll<SVGGElement>(
      'g[id^="booth-"]'
    );

    booths.forEach((el) => {
      el.style.cursor = "pointer";

      el.addEventListener("click", () => {
        const rawId = el.id.replace("booth-", ""); // "78"
        const boothNumber = String(rawId);          // ✅ STRING

        const booth = getBoothByNumber(boothNumber);

        if (!booth) {
          console.warn("Nie znaleziono stoiska:", boothNumber);
          return;
        }

        setSelectedBooth(booth);
        setModalOpen(true);
      });
    });

    return () => {
      booths.forEach((el) => {
        el.replaceWith(el.cloneNode(true));
      });
    };
  }, [getBoothByNumber, setSelectedBooth, setModalOpen]);

  return <div ref={containerRef} className="w-full overflow-auto" />;
};
