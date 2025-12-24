"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { searchForum } from "@/lib/actions/forum";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export function ForumSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    const res = await searchForum(val);
    if (res.success) {
      setResults(res.data || []);
    }
    setLoading(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une discussion..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />}
      </div>

      {results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl border-[var(--border)] overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto">
            {results.map((thread) => (
              <Link 
                key={thread.id} 
                href={`/admin/forum/thread/${thread.id}`}
                onClick={() => { setQuery(""); setResults([]); }}
                className="flex flex-col p-3 hover:bg-[var(--background-secondary)] border-b border-[var(--border)] last:border-0"
              >
                <span className="font-medium text-sm">{thread.title}</span>
                <span className="text-[10px] text-muted-foreground uppercase">{thread.categoryName} • Par {thread.authorName}</span>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
