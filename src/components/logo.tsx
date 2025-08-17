import { Hexagon } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-3 calico-fade-in">
      <div className="flex items-center justify-center w-10 h-10">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main square */}
          <rect
            x="8"
            y="8"
            width="24"
            height="24"
            rx="2"
            fill="url(#purpleGradient)"
            transform="rotate(15 20 20)"
          />
          {/* Overlapping square */}
          <rect
            x="12"
            y="12"
            width="16"
            height="16"
            rx="1.5"
            fill="url(#purpleGradient)"
            opacity="0.8"
            transform="rotate(-10 20 20)"
          />
          {/* Inner square */}
          <rect
            x="16"
            y="16"
            width="8"
            height="8"
            rx="1"
            fill="url(#purpleGradient)"
            opacity="0.6"
            transform="rotate(5 20 20)"
          />
          <defs>
            <linearGradient
              id="purpleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6B46C1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h1 className="calico-logo">calico</h1>
    </div>
  );
}
