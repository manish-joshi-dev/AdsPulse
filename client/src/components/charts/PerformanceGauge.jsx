import { useEffect, useRef } from 'react';

export const PerformanceGauge = ({ score = 0, size = 200, animated = true }) => {
  const ref = useRef(null);
  const strokeWidth = size * 0.15;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 1.5 * Math.PI; // Approx for 270 deg

  const getColor = (s) => {
    if (s < 40) return '#f43f5e'; // rose
    if (s < 70) return '#f59e0b'; // amber
    return '#10b981'; // emerald
  };

  useEffect(() => {
    if (!animated) return;
    let start;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / 1000, 1);
      const current = progress * score;
      if (ref.current) ref.current.textContent = Math.round(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score, animated]);

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>
      <svg className="h-full w-full -rotate-[135deg]">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e4e4e7" strokeWidth={strokeWidth} strokeDasharray={`${circumference} ${circumference}`} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={getColor(score)} strokeWidth={strokeWidth} strokeDasharray={`${(score / 100) * circumference} ${circumference}`} className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span ref={ref} className="text-4xl font-bold">{animated ? 0 : score}</span>
        <span className="text-xs uppercase font-medium text-zinc-500">Score</span>
      </div>
    </div>
  );
};

export const MiniGauge = (props) => <PerformanceGauge {...props} size={80} />;
