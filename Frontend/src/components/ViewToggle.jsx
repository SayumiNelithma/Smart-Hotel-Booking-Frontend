import { Grid3x3, List } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function ViewToggle({ view, onChange, className }) {
  return (
    <div className={cn("flex items-center gap-1 border rounded-lg p-1 bg-muted/50", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange("grid")}
        className={cn(
          "flex-1",
          view === "grid"
            ? "bg-background shadow-sm"
            : "hover:bg-background/50"
        )}
        aria-label="Grid view"
        aria-pressed={view === "grid"}
      >
        <Grid3x3 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange("list")}
        className={cn(
          "flex-1",
          view === "list"
            ? "bg-background shadow-sm"
            : "hover:bg-background/50"
        )}
        aria-label="List view"
        aria-pressed={view === "list"}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}

