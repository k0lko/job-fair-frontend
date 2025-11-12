import React from "react";
import type { Booth } from "../types";
import { useBoothStore } from "../store/boothStore";

interface InteractiveMapProps {
  onBoothClick: (booth: Booth) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ onBoothClick }) => {
  const { booths } = useBoothStore();

  // Kolor stoiska w zależności od statusu
  const getBoothColor = (status: Booth["status"]) => {
    switch (status) {
      case "available":
        return "#10b981"; // zielony
      case "reserved":
        return "#f59e0b"; // żółty
      case "occupied":
        return "#ef4444"; // czerwony
      default:
        return "#6b7280"; // szary
    }
  };

  // Jeśli brak stoisk z backendu, tworzymy przykładowe dane
  const displayBooths: Booth[] =
    booths.length > 0
      ? booths
      : Array.from({ length: 60 }, (_, i) => ({
          id: (i + 1).toString(),
          number: `${i + 1}`,
          status: (i % 7 === 0
            ? "reserved"
            : i % 5 === 0
            ? "occupied"
            : "available") as Booth["status"],
          size: i % 2 === 0 ? "1x1" : "2x1",
          price: i % 2 === 0 ? 1300 : 1600,
          x: (i % 10) * 90 + 40,
          y: Math.floor(i / 10) * 80 + 50,
          width: 70,
          height: 60,
        }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full font-[Saira]">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center sm:text-left">
        Plan Targów
      </h2>

      {/* Kontener mapy */}
      <div className="relative bg-gray-50 rounded-lg border-2 border-gray-200 overflow-x-auto overflow-y-hidden p-2 sm:p-4 touch-pan-x">
        <svg
          viewBox="0 0 1000 600"
          className="min-w-[600px] w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Tytuł */}
          <text
            x="50%"
            y="20"
            fontSize="18"
            fontWeight="bold"
            fill="#374151"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            Politechnika Bydgoska — Your Future 2025
          </text>

          {/* Obrys hali */}
          <rect
            x="20"
            y="40"
            width="950"
            height="520"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="3"
            rx="8"
          />

          {/* Stoiska */}
          {displayBooths.map((booth) => (
            <g
              key={booth.id}
              onClick={() => booth.status === "available" && onBoothClick(booth)}
              className="transition-transform duration-200 hover:scale-105"
              style={{
                cursor: booth.status === "available" ? "pointer" : "not-allowed",
              }}
            >
              <rect
                x={booth.x}
                y={booth.y}
                width={booth.width}
                height={booth.height}
                fill={getBoothColor(booth.status)}
                stroke="#374151"
                strokeWidth="2"
                rx="6"
              />
              <text
                x={booth.x + booth.width / 2}
                y={booth.y + booth.height / 2 + 5}
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
              >
                {booth.number}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legenda */}
      <div className="mt-6 flex justify-center sm:justify-between flex-wrap gap-4 text-gray-700 text-sm sm:text-base">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
          <span>Dostępne</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-amber-500 rounded mr-2"></div>
          <span>Zarezerwowane</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
          <span>Zajęte</span>
        </div>
      </div>
    </div>
  );
};
