import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={cn(
        "appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-300",
        className
      )}
      {...props}
    />
  );
}

Textarea.displayName = "Textarea";
