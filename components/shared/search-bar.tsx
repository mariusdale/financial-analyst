"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/lib/hooks";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results = [], isLoading } = useSearch(debouncedQuery);

  const handleSelect = useCallback(
    (symbol: string) => {
      setQuery("");
      setIsOpen(false);
      router.push(`/stock/${symbol}`);
    },
    [router]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder="Search tickers..."
          className="pl-10 pr-8 h-9 bg-muted/50 border-border/50 focus:bg-background text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isOpen && debouncedQuery.length > 0 && (
        <div className="absolute top-full mt-1 w-full rounded-lg border bg-popover shadow-lg z-50 max-h-72 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">Searching...</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">No results found</div>
          ) : (
            results.map((r) => (
              <button
                key={r.symbol}
                onClick={() => handleSelect(r.symbol)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-accent transition-colors"
              >
                <div>
                  <span className="font-semibold text-sm">{r.symbol}</span>
                  <span className="text-xs text-muted-foreground ml-2 truncate">
                    {r.name}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {r.exchangeShortName}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
