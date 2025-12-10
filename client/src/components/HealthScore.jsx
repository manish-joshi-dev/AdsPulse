import clsx from "clsx";
import { scoreTone } from "../utils/formatters.js";

export const HealthScore = ({ score = 0, grade = "F" }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <section className="panel flex min-h-64 flex-col justify-between p-6">
      <div>
        <p className="text-sm font-medium uppercase text-zinc-500">Performance score</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">Account grade {grade}</h2>
      </div>
      <div className="flex items-center justify-center py-4">
        <div className="relative h-40 w-40">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140" aria-hidden="true">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="#e4e4e7" strokeWidth="14" />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={clsx("transition-all duration-700", scoreTone(score))}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={clsx("text-4xl font-semibold", scoreTone(score))}>{score}</span>
            <span className="text-sm text-zinc-500">/ 100</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-zinc-500">
        Weighted by CTR, conversion rate, CPA, wasted spend, and qualified volume.
      </p>
    </section>
  );
};

