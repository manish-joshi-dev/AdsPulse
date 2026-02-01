import { useEffect, useRef } from 'react';

/**
 * ScoreGauge - SVG arc gauge showing performance score 0-100
 */
export const ScoreGauge = ({ score = 0, scoreBand = 'Average', size = 200 }) => {
  const canvasRef = useRef(null);

  // Determine color based on score
  const getColor = (value) => {
    if (value >= 80) return '#10B981'; // Excellent - green
    if (value >= 60) return '#34D399'; // Good - teal
    if (value >= 40) return '#FBBF24'; // Average - amber
    if (value >= 20) return '#FB923C'; // Poor - orange
    return '#F87171'; // Critical - red
  };

  const bandColors = {
    'Excellent': '#10B981',
    'Good': '#34D399',
    'Average': '#FBBF24',
    'Poor': '#FB923C',
    'Critical': '#F87171'
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    const startAngle = Math.PI * 1.25; // 225 degrees
    const endAngle = Math.PI * 0.25; // -45 degrees (relative to start)
    const totalAngle = Math.PI * 1.5; // 270 degrees total sweep

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background arc
    ctx.strokeStyle = 'rgba(30, 45, 69, 0.5)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + totalAngle, false);
    ctx.stroke();

    // Progress arc
    const progressAngle = (score / 100) * totalAngle;
    const color = getColor(score);
    
    // Create gradient
    const gradient = ctx.createLinearGradient(
      centerX - radius, centerY,
      centerX + radius, centerY
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, color);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + progressAngle, false);
    ctx.stroke();

    // Score text
    ctx.fillStyle = '#F1F5F9';
    ctx.font = `bold 48px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(score)}`, centerX, centerY - 10);

    // Band label
    ctx.fillStyle = '#94A3B8';
    ctx.font = `14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(scoreBand, centerX, centerY + 15);
  }, [score, scoreBand]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="block"
      />
      <div className="mt-4 grid grid-cols-5 gap-2 w-full max-w-xs">
        {[
          { label: 'Critical', color: '#F87171' },
          { label: 'Poor', color: '#FB923C' },
          { label: 'Average', color: '#FBBF24' },
          { label: 'Good', color: '#34D399' },
          { label: 'Excellent', color: '#10B981' }
        ].map((band) => (
          <div
            key={band.label}
            className="text-center"
          >
            <div
              className="w-3 h-3 rounded-full mx-auto mb-1"
              style={{ background: band.color }}
            />
            <p
              className="text-xs font-medium"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {band.label.split(' ')[0]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreGauge;
