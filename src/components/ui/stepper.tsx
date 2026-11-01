import { cn } from "@/lib/cn";

interface StepperProps {
  total: number;
  current: number;
  label: string;
}

/** Numbered progress bar. Completed + current steps are filled; the track fills up to the current step. */
export function Stepper({ total, current, label }: StepperProps) {
  const progress = ((current - 1) / (total - 1)) * 100;
  return (
    <div role="group" aria-label={label} className="relative flex items-center justify-between">
      <div aria-hidden className="absolute inset-x-4 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-line" />
      <div
        aria-hidden
        className="absolute start-4 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary transition-[width] duration-500"
        style={{ width: `calc((100% - 2rem) * ${progress / 100})` }}
      />
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const reached = n <= current;
        return (
          <span
            key={n}
            aria-current={n === current ? "step" : undefined}
            className={cn(
              "relative grid size-8 place-items-center rounded-full text-sm font-bold transition-colors duration-500",
              reached ? "bg-primary text-white" : "bg-line text-muted",
            )}
          >
            {n}
          </span>
        );
      })}
    </div>
  );
}
