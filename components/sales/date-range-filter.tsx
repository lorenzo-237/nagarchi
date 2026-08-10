"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateRange {
  from: string;
  to: string;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="feed-from">Du</Label>
        <Input
          id="feed-from"
          type="date"
          value={value.from}
          max={value.to}
          onChange={(event) => onChange({ from: event.target.value, to: value.to })}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="feed-to">Au</Label>
        <Input
          id="feed-to"
          type="date"
          value={value.to}
          min={value.from}
          onChange={(event) => onChange({ from: value.from, to: event.target.value })}
        />
      </div>
    </div>
  );
}
