"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  currentPage: number;
}

export interface FlexibleSelectProps {
  // Basic props
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default";

  // Data props (externally managed)
  options: SelectOption[];
  loading?: boolean;
  error?: string | null;

  // Search functionality
  searchable?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;

  // Pagination props (externally managed)
  pagination?: PaginationInfo | null;
  onLoadMore?: () => void;
  loadingMore?: boolean;

  // Display text
  loadingText?: string;
  emptyText?: string;
  errorText?: string;
}

export function FlexibleSelect({
  value,
  onValueChange,
  placeholder = "Pilih item...",
  disabled = false,
  className,
  size = "default",
  options = [],
  loading = false,
  error = null,
  searchable = false,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Cari...",
  pagination = null,
  onLoadMore,
  loadingMore = false,
  loadingText = "Sedang memuat...",
  emptyText = "Belum ada item",
  errorText = "Gagal memuat item",
}: FlexibleSelectProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);

  const hasNextPage = pagination
    ? pagination.currentPage * pagination.limit < pagination.total
    : false;

  const filteredOptions = useMemo(() => {
    if (!searchable) return options;

    if (onSearchChange) return options;

    const query = localSearchQuery.toLowerCase().trim();
    if (!query) return options;

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) || option.value.toLowerCase().includes(query),
    );
  }, [options, searchable, onSearchChange, localSearchQuery]);

  const handleSearchChange = (query: string) => {
    if (onSearchChange) {
      onSearchChange(query);
    } else {
      setLocalSearchQuery(query);
    }
  };

  const currentSearchQuery = onSearchChange ? searchQuery : localSearchQuery;

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    if (!isOpen && !onSearchChange) {
      setLocalSearchQuery("");
    }
  }, [isOpen, onSearchChange]);

  useEffect(() => {
    if (value) {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <Select
      value={displayValue}
      onValueChange={onValueChange}
      disabled={disabled}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger className={className} size={size}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {searchable && (
          <div className="flex items-center border-b px-3 pb-2">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={currentSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="flex h-8 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        )}

        <div className="max-h-[200px] overflow-y-auto">
          {loading && options.length === 0 && (
            <div className="flex items-center justify-center py-4">
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">{loadingText}</span>
            </div>
          )}

          {error && (
            <div className="px-2 py-4 text-center">
              <span className="text-sm text-destructive">{errorText}</span>
            </div>
          )}

          {!loading && !error && filteredOptions.length === 0 && (
            <div className="px-2 py-4 text-center">
              <span className="text-sm text-muted-foreground">{emptyText}</span>
            </div>
          )}

          {filteredOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}

          {(loadingMore || hasNextPage) && (
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoadMore}
                disabled={loadingMore}
                className="w-full"
              >
                {loadingMore ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    Sedang memuat...
                  </>
                ) : (
                  `Lebih banyak (${options.length} of ${pagination?.total})`
                )}
              </Button>
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}
