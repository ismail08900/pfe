import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react"; // Lucide React icon

export default function ProgressRing({ value, max, label, color, unit }) {
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);
  const percent = Math.min((value / max) * 100, 100);
  const gradientId = `gradient-${label.replace(/\s/g, "")}`;
  const displayValue = `${Math.round(value)}/${max} ${unit}`;
  const isExceeded = value > max;
  const exceededAmount = Math.round(value - max);
  const reste = Math.max(0, Math.round(max - value));

  // Tooltip state is managed by DaisyUI classes (no JS state needed)

  useEffect(() => {
    setProgress(0);
    const duration = 800;
    const steps = 120;
    const increment = percent / steps;
    const interval = duration / steps;

    let currentStep = 0;
    const animation = setInterval(() => {
      currentStep++;
      setProgress(Math.min(increment * currentStep, percent));
      if (currentStep >= steps) clearInterval(animation);
    }, interval);

    return () => clearInterval(animation);
  }, [percent]);

  return (
    <div
      className="flex flex-col items-center transition-transform duration-300 hover:scale-105 group"
      style={{ minWidth: 180, minHeight: 180, position: "relative" }}
    >
      <div
        className={
          "relative w-44 h-44 drop-shadow-xl transition-shadow duration-300 group-hover:drop-shadow-2xl bg-white rounded-full tooltip"
        }
        data-tip={
          isExceeded
            ? `Objectif dépassé. +${exceededAmount} ${unit} !`
            : `Il vous reste ${reste} ${unit}`
        }
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <svg style={{ height: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="1" y1="1" x2="1" y2="1">
              <stop offset="0%" stopColor={color[0]} />
              <stop offset="100%" stopColor={color[1]} />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgressbarWithChildren
          value={progress}
          strokeWidth={8}
          styles={buildStyles({
            pathColor: `url(#${gradientId})`,
            trailColor: "#f3f4f6",
            strokeLinecap: "round",
            transition: "none",
          })}
        >
          <div className="flex flex-col items-center justify-center">
            {isExceeded ? (
              <>
                <AlertTriangle className="w-10 h-10 text-red-600 mb-1" />
                <span className="text-lg font-bold text-red-700">
                  {Math.round(value)} {unit}
                </span>
              </>
            ) : hovered ? (
              <span className="text-lg font-bold text-gray-900 ">
                {Math.round(percent)}%
              </span>
            ) : (
              <span className="text-lg font-bold text-gray-900 ">
                {displayValue}
              </span>
            )}
          </div>
        </CircularProgressbarWithChildren>
      </div>
      <span className="mt-4 text-lg font-semibold text-gray-600 tracking-wide">
        {label}
      </span>
    </div>
  );
}
