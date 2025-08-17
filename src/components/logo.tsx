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
          className="animate-spin-slow"
          style={{
            animation: 'spin 8s linear infinite'
          }}
        >
          {/* Outer square outline */}
          <rect
            x="4"
            y="4"
            width="32"
            height="32"
            rx="3"
            stroke="url(#purpleGradient1)"
            strokeWidth="1.5"
            fill="none"
            transform="rotate(0 20 20)"
          />
          
          {/* Second square outline */}
          <rect
            x="7"
            y="7"
            width="26"
            height="26"
            rx="2.5"
            stroke="url(#purpleGradient2)"
            strokeWidth="1.2"
            fill="none"
            transform="rotate(15 20 20)"
          />
          
          {/* Third square outline */}
          <rect
            x="10"
            y="10"
            width="20"
            height="20"
            rx="2"
            stroke="url(#purpleGradient3)"
            strokeWidth="1"
            fill="none"
            transform="rotate(-10 20 20)"
          />
          
          {/* Fourth square outline */}
          <rect
            x="13"
            y="13"
            width="14"
            height="14"
            rx="1.5"
            stroke="url(#purpleGradient4)"
            strokeWidth="0.8"
            fill="none"
            transform="rotate(25 20 20)"
          />
          
          {/* Fifth square outline */}
          <rect
            x="16"
            y="16"
            width="8"
            height="8"
            rx="1"
            stroke="url(#purpleGradient5)"
            strokeWidth="0.6"
            fill="none"
            transform="rotate(-5 20 20)"
          />
          
          {/* Center square */}
          <rect
            x="18"
            y="18"
            width="4"
            height="4"
            rx="0.5"
            fill="url(#purpleGradient6)"
            transform="rotate(10 20 20)"
          />
          
          <defs>
            {/* Darker purple gradient for outer squares */}
            <linearGradient
              id="purpleGradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#4C1D95" />
              <stop offset="100%" stopColor="#6B21A8" />
            </linearGradient>
            
            <linearGradient
              id="purpleGradient2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#5B21B6" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            
            <linearGradient
              id="purpleGradient3"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#6B21A8" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            
            <linearGradient
              id="purpleGradient4"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
            
            <linearGradient
              id="purpleGradient5"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#C4B5FD" />
            </linearGradient>
            
            {/* Lightest purple gradient for center */}
            <linearGradient
              id="purpleGradient6"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#DDD6FE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h1 className="calico-logo">calico</h1>
    </div>
  );
}
