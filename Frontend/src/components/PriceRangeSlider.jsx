import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

export function PriceRangeSlider({
  minPrice = 0,
  maxPrice = 1000,
  value = { min: 0, max: 1000 },
  onChange,
  className,
}) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), localValue.max);
    const newValue = { ...localValue, min: newMin };
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), localValue.min);
    const newValue = { ...localValue, max: newMax };
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const minPercent = ((localValue.min - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPercent = ((localValue.max - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
        <span>${localValue.min}</span>
        <span>${localValue.max}</span>
      </div>
      
      <div className="relative h-2 bg-muted rounded-full">
        <div
          className="absolute h-2 bg-primary rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="min-slider" className="text-xs mb-1 block">
            Min
          </Label>
          <input
            id="min-slider"
            type="range"
            min={minPrice}
            max={maxPrice}
            value={localValue.min}
            onChange={handleMinChange}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            style={{
              background: `linear-gradient(to right, 
                var(--primary) 0%, 
                var(--primary) ${minPercent}%, 
                var(--muted) ${minPercent}%, 
                var(--muted) 100%)`,
            }}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="max-slider" className="text-xs mb-1 block">
            Max
          </Label>
          <input
            id="max-slider"
            type="range"
            min={minPrice}
            max={maxPrice}
            value={localValue.max}
            onChange={handleMaxChange}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            style={{
              background: `linear-gradient(to right, 
                var(--muted) 0%, 
                var(--muted) ${maxPercent}%, 
                var(--primary) ${maxPercent}%, 
                var(--primary) 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

