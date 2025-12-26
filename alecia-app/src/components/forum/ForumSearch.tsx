"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { searchForum } from "@/lib/actions/forum";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface SearchResult {
  id: string;
  title: string;
  categoryName: string | null;
  authorName: string | null;
}

export function ForumSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
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
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bodydark2 group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Rechercher une discussion..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 h-11 bg-white dark:bg-boxdark border-stroke dark:border-strokedark focus:border-primary"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />}
      </div>

      {results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-2xl border-stroke dark:border-strokedark bg-white dark:bg-boxdark overflow-hidden ring-1 ring-black/5">
          <div className="max-h-[350px] overflow-y-auto">
            <div className="p-2 border-b border-stroke dark:border-strokedark bg-gray-50 dark:bg-meta-4/10">
                <p className="text-[10px] font-bold text-bodydark2 uppercase tracking-widest px-2">Résultats de recherche</p>
            </div>
            {results.map((thread) => (
              <Link 
                key={thread.id} 
                href={`/admin/forum/thread/${thread.id}`}
                onClick={() => { setQuery(""); setResults([]); }}
                className="flex flex-col p-3 hover:bg-primary/5 transition-colors border-b border-stroke dark:border-strokedark last:border-0 group"
              >
                <span className="font-bold text-sm text-black dark:text-white group-hover:text-primary transition-colors">{thread.title}</span>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-bold text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded leading-none">{thread.categoryName}</span>
                    <span className="text-[10px] text-bodydark2 font-medium">Par {thread.authorName}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}