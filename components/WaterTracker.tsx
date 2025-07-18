import React from 'react';

interface WaterTrackerProps {
  glasses: boolean[];
  onToggle: (index: number) => void;
}

export default function WaterTracker({ glasses, onToggle }: WaterTrackerProps) {
  return (
    <div>
      <h3 className="figma-hand-bold text-lg text-gray-800 mb-3">Water Intake</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {glasses.map((filled, index) => (
          <button
            key={index}
            onClick={() => onToggle(index)}
            className="transition-all duration-300 ease-in-out hover:scale-110"
          >
            <svg
              width="32"
              height="40"
              viewBox="0 0 32 40"
              className={`transition-all duration-300 ${
                filled ? 'opacity-100' : 'opacity-50'
              }`}
              style={{ 
                filter: filled 
                  ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' 
                  : 'none' 
              }}
            >
              {/* Glass outline */}
              <path
                d="M6 8 L26 8 L24 36 L8 36 Z"
                fill={filled ? "#4FC3F7" : "white"}
                stroke="#333"
                strokeWidth="2"
                className="transition-colors duration-300"
              />
              {/* Water level */}
              {filled && (
                <path
                  d="M7 10 L25 10 L23.5 34 L8.5 34 Z"
                  fill="#2196F3"
                  className="animate-pulse"
                />
              )}
              {/* Glass rim */}
              <ellipse
                cx="16"
                cy="8"
                rx="10"
                ry="2"
                fill="none"
                stroke="#333"
                strokeWidth="2"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}