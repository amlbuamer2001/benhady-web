import { cn } from "@/lib/cn";

export function FormAlert({ message, tone = "error" }: { message?: string; tone?: "error" | "success" }) {
  if (!message) return null;
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-2xl px-4 py-3 text-center text-xs",
        tone === "error" ? "bg-danger/10 text-danger" : "bg-primary-100 text-ink",
      )}
    >
      {message}
    </p>
  );
}
