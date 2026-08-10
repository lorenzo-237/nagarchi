"use client";

import * as React from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ArchimonsterSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ArchimonsterSearch({ value, onChange }: ArchimonsterSearchProps) {
  const [inputValue, setInputValue] = React.useState(value);

  React.useEffect(() => {
    const timeout = setTimeout(() => onChange(inputValue), 300);
    return () => clearTimeout(timeout);
  }, [inputValue, onChange]);

  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Rechercher un archimonstre..."
        className="h-9 pl-9"
      />
    </div>
  );
}
