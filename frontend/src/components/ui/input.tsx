import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base input styles
        "flex h-full w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1",
        "placeholder:text-muted-foreground file:bg-primary file:text-white file:border-0 file:px-4 file:py-1.5 file:mr-4 file:rounded file:cursor-pointer file:hover:bg-primary/90",
        "file:transition-colors file:font-medium file:text-sm",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  );
}

export { Input };
