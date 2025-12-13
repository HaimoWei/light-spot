"use client";

import { Printer } from "lucide-react";
import { Button } from "./Button";

type Props = {
  label: string;
  className?: string;
};

export function PrintButton({ label, className }: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={() => window.print()}
      aria-label={label}
    >
      <Printer className="h-4 w-4" />
      {label}
    </Button>
  );
}

