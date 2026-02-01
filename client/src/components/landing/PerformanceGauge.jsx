import { useEffect, useState } from 'react';

/**
 * Animated SVG arc gauge showing performance score (0-100)
 * Used in landing page and app for visual score representation
 */
export const PerformanceGauge = ({ score = 75, size = 200, animated = true }) => {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  
  useEffect(() => {
    if (!animated) return;
    
    let current = 0;
    const increment = score / 60; // Animate over ~60 frames
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, 16); // ~60fps
    
    return () => clearInterval(timer);
  }, [score, animated]);

  // Determine color based on score
  const getColor = (val) => {
    if (val < 20) return '#F87171'; // Critical - red
    if (val < 40) return '#FB923C'; // Poor - orange
    if (val < 60) return '#FBBF24'; // Average - amber
    if (val < 80) return '#34D399'; // Good - green
    return '#10B981'; // Excellent - emerald
  };

  const getBand = (val) => {
    if (val < 20) return 'Critical';
    if (val < 40) return 'Poor';
    if (val < 60) return 'Average';
    if (val < 80) return 'Good';
    return 'Excellent';
  };

  // SVG arc gauge parameters
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - displayScore / 100);
  const color = getColor(displayScore);

  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ width: size, height: size }} className="relative">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
        >
          {/* Background arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1E2D45"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.05s linear, stroke 0.3s ease'
            }}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-[#F1F5F9]">{displayScore}</div>
          <div className="text-xs font-semibold text-[#94A3B8]">/ 100</div>
        </div>
      </div>
      
      {/* Score band label */}
      <div className="text-center">
        <div className="text-sm font-semibold" style={{ color }}>
          {getBand(displayScore)}
        </div>
      </div>
    </div>
  );
};

export default PerformanceGauge;
