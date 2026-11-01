import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { CheckIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  children: ReactNode;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

export function Checkbox({ children, error, className, ref, ...rest }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={cn("flex cursor-pointer items-center gap-2 text-xs text-ink", className)}>
        <input ref={ref} type="checkbox" className="peer sr-only" {...rest} />
        <span
          aria-hidden
          className={cn(
            "grid size-5 shrink-0 place-items-center rounded-md border bg-field text-transparent transition-colors",
            "peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white",
            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary",
            error ? "border-danger" : "border-line",
          )}
        >
          <CheckIcon width={12} height={12} />
        </span>
        <span>{children}</span>
      </label>
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
