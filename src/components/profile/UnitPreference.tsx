import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface UnitPreferenceProps {
  defaultUnit?: "km" | "miles";
  onUnitChange?: (unit: "km" | "miles") => void;
  className?: string;
}

const UnitPreference = ({
  defaultUnit = "km",
  onUnitChange,
  className,
}: UnitPreferenceProps) => {
  const [unit, setUnit] = useState<"km" | "miles">(defaultUnit);

  const handleUnitChange = (checked: boolean) => {
    const newUnit = checked ? "miles" : "km";
    setUnit(newUnit);
    onUnitChange?.(newUnit);
  };

  return (
    <div className={cn("p-4 rounded-lg bg-white dark:bg-gray-800", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Distance Unit</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose your preferred unit of measurement
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Label
            htmlFor="unit-toggle"
            className={`text-sm ${unit === "km" ? "font-bold" : "text-gray-500"}`}
          >
            KM
          </Label>
          <Switch
            id="unit-toggle"
            checked={unit === "miles"}
            onCheckedChange={handleUnitChange}
          />
          <Label
            htmlFor="unit-toggle"
            className={`text-sm ${unit === "miles" ? "font-bold" : "text-gray-500"}`}
          >
            Miles
          </Label>
        </div>
      </div>
    </div>
  );
};

export default UnitPreference;
