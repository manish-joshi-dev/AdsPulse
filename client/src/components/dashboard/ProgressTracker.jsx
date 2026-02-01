import { useState, useEffect } from 'react';
import { Zap, CheckCircle2 } from 'lucide-react';

/**
 * ProgressTracker - Shows real-time progress of analysis job
 */
export const ProgressTracker = ({ progress = 0, status = 'processing', currentStep = 'Parsing CSV...' }) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (progress > displayProgress) {
      const timer = setTimeout(() => {
        setDisplayProgress(Math.min(displayProgress + 1, progress));
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [progress, displayProgress]);

  const steps = [
    { label: 'Parsing CSV', threshold: 25 },
    { label: 'Running diagnostics', threshold: 50 },
    { label: 'Computing score', threshold: 60 },
    { label: 'Detecting anomalies', threshold: 70 },
    { label: 'Generating recommendations', threshold: 85 },
    { label: 'Saving results', threshold: 95 },
    { label: 'Completing...', threshold: 100 }
  ];

  const isComplete = displayProgress >= 100;

  return (
    <div
      className="p-8 rounded-xl border"
      style={{
        background: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)'
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isComplete ? 'bg-[#34D399]/20' : 'bg-[#4F8EF7]/20'
          }`}
        >
          {isComplete ? (
            <CheckCircle2 className="w-6 h-6 text-[#34D399]" />
          ) : (
            <Zap className="w-6 h-6 text-[#4F8EF7] animate-pulse" />
          )}
        </div>
        <div>
          <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {isComplete ? 'Analysis Complete! ✓' : 'Analyzing Your Campaigns'}
          </p>
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
            {currentStep}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm font-medium">
            Progress
          </p>
          <p
            style={{ color: 'var(--color-accent-primary)' }}
            className="text-sm font-bold"
          >
            {displayProgress}%
          </p>
        </div>

        {/* Animated progress bar */}
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{
            background: 'var(--color-bg-primary)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-300 relative"
            style={{
              width: `${displayProgress}%`,
              background: isComplete
                ? 'linear-gradient(90deg, #34D399, #10B981)'
                : 'linear-gradient(90deg, #4F8EF7, #60A5FA)'
            }}
          >
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                animation: 'shimmer 2s infinite'
              }}
            />
          </div>
        </div>
      </div>

      {/* Step tracker */}
      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isActive = displayProgress >= step.threshold;
          const isCurrentStep = displayProgress < step.threshold && displayProgress >= (idx > 0 ? steps[idx - 1].threshold : 0);

          return (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-lg transition-all"
              style={{
                background: isActive ? 'rgba(79, 142, 247, 0.1)' : 'rgba(0,0,0,0)',
                borderLeft: `3px solid ${isActive ? '#4F8EF7' : isCurrentStep ? '#FBBF24' : 'var(--color-border)'}`
              }}
            >
              <div
                className={`w-4 h-4 rounded-full flex-shrink-0 ${
                  isActive
                    ? 'bg-[#4F8EF7]'
                    : isCurrentStep
                    ? 'bg-[#FBBF24] animate-pulse'
                    : 'bg-[#1E2D45]'
                }`}
              />
              <p
                className="text-sm font-medium"
                style={{
                  color: isActive
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-secondary)'
                }}
              >
                {step.label}
              </p>
              {isActive && displayProgress !== 100 && (
                <div className="ml-auto flex gap-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-[#4F8EF7] animate-pulse"
                    style={{ animationDelay: '0s' }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-[#4F8EF7] animate-pulse"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-[#4F8EF7] animate-pulse"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CSS */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ProgressTracker;
