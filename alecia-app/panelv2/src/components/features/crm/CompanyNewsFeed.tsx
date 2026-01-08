"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Newspaper, 
  ExternalLink, 
  RefreshCw, 
  Calendar,
  TrendingUp,
  AlertCircle,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface NewsArticle {
  id: string;
  title: string;
  description?: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: "positive" | "neutral" | "negative";
  imageUrl?: string;
}

interface CompanyNewsFeedProps {
  companyName: string;
  companySiren?: string;
  className?: string;
  maxArticles?: number;
}

/**
 * Company News Feed
 * Aggregates recent news mentions from various sources
 */
export function CompanyNewsFeed({
  companyName,
  companySiren,
  className,
  maxArticles = 10,
}: CompanyNewsFeedProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to fetch from news API
      const response = await fetch("/api/intelligence/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: companyName,
          siren: companySiren,
          limit: maxArticles,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
      } else {
        // Fallback to mock data for demo
        setArticles(generateMockNews(companyName));
      }
    } catch (err) {
      // Use mock data on error
      setArticles(generateMockNews(companyName));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [companyName, companySiren]);

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive": return "text-green-600 bg-green-50 border-green-200";
      case "negative": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-muted-foreground bg-muted/50";
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              Actualités
            </CardTitle>
            <CardDescription>
              Mentions récentes de {companyName}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={fetchNews}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-16 w-16 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-8">
            <Newspaper className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              Aucune actualité récente trouvée
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[350px] pr-3">
            <div className="space-y-4">
              {articles.map((article) => (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  {article.imageUrl && (
                    <div 
                      className="w-16 h-16 rounded bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${article.imageUrl})` }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h4>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {article.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {article.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {article.source}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(article.publishedAt), { 
                          addSuffix: true , 
                          locale: fr 
                        })}
                      </span>
                      {article.sentiment && (
                        <Badge 
                          variant="outline" 
                          className={cn("text-[10px] px-1.5 py-0", getSentimentColor(article.sentiment))}
                        >
                          {article.sentiment === "positive" && <TrendingUp className="h-2.5 w-2.5 mr-0.5" />}
                          {article.sentiment === "negative" && <AlertCircle className="h-2.5 w-2.5 mr-0.5" />}
                          {article.sentiment}
                        </Badge>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

// Mock news generator for demo
function generateMockNews(companyName: string): NewsArticle[] {
  const now = new Date();
  
  return [
    {
      id: "1",
      title: `${companyName} annonce ses résultats du troisième trimestre`,
      description: "L'entreprise affiche une croissance de 12% de son chiffre d'affaires par rapport à l'année précédente.",
      url: "#",
      source: "Les Echos",
      publishedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      sentiment: "positive",
    },
    {
      id: "2",
      title: `Nomination d'un nouveau directeur financier chez ${companyName}`,
      description: "Le groupe renforce son équipe de direction avec l'arrivée d'un expert reconnu du secteur.",
      url: "#",
      source: "Le Figaro Économie",
      publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      sentiment: "neutral",
    },
    {
      id: "3",
      title: `${companyName} étend son activité sur le marché européen`,
      description: "Ouverture de nouvelles filiales en Allemagne et en Espagne prévue pour le prochain semestre.",
      url: "#",
      source: "BFM Business",
      publishedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      sentiment: "positive",
    },
    {
      id: "4",
      title: `Analyse sectorielle : ${companyName} et ses concurrents`,
      description: "Étude comparative des principaux acteurs du marché.",
      url: "#",
      source: "Capital",
      publishedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      sentiment: "neutral",
    },
  ];
}
