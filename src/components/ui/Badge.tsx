import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "success";
};

export function Badge({ className, tone = "default", ...props }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tone === "success"
          ? "border-success/40 bg-success/10 text-success"
          : "border-border bg-bg-muted/40 text-text-muted",
        className
      )}
      {...props}
    />
  );
}

