"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Input } from "../ui/input";

interface AppSearchBarProps {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  search: string;
  onSearch: (value: string) => void;
  showClearIcon?: boolean;
  onClear?: () => void;
}

export function AppSearchBar({
  className,
  inputClassName,
  placeholder = "Cari ...",
  search,
  onSearch,
  showClearIcon = false,
  onClear,
}: AppSearchBarProps) {
  return (
    <div className={cn("w-full min-w-[100px] relative", className)}>
      <Input
        className={cn("w-full", inputClassName)}
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        value={search}
      />
      {showClearIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <X
            className="h-5 w-5 text-gray-500 cursor-pointer z-50 rounded-full p-0.5 bg-gray-200"
            onClick={() => {
              onClear?.();
            }}
          />
        </div>
      )}
    </div>
  );
}
