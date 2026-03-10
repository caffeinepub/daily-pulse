import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { Rss, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Article } from "../backend.d";
import { ArticleCard } from "../components/ArticleCard";
import { useListArticles } from "../hooks/useQueries";

const CATEGORIES = [
  "All",
  "World",
  "Politics",
  "Technology",
  "Sports",
  "Entertainment",
  "Science",
];

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

function ArticleSkeleton() {
  return (
    <div className="border border-border overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded-none" />
        <Skeleton className="h-4 w-full rounded-none" />
        <Skeleton className="h-4 w-1/2 rounded-none" />
      </div>
    </div>
  );
}

export function FeedPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearch = (val: string) => {
    setSearchText(val);
    clearTimeout((window as any).__searchTimeout);
    (window as any).__searchTimeout = setTimeout(
      () => setDebouncedSearch(val),
      300,
    );
  };

  const apiCategory = category === "All" ? null : category;
  const apiSearch = debouncedSearch.trim() || null;

  const {
    data: allArticles,
    isLoading,
    isError,
  } = useListArticles(apiCategory, apiSearch);

  const articles: Article[] = useMemo(() => {
    if (!allArticles) return [];
    return allArticles.filter((a) => a.isPublished);
  }, [allArticles]);

  const heroArticle = articles[0] ?? null;
  const gridArticles = articles.slice(1);

  return (
    <main className="min-h-screen">
      {/* Page header */}
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="ink-divider mb-4" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Top Stories
          </h1>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search stories..."
              className="pl-9 rounded-none"
              data-ocid="feed.search_input"
            />
          </div>
        </div>
        <div className="ink-divider-light mt-4" />
      </div>

      {/* Category tabs */}
      <div className="container max-w-7xl mx-auto px-4 mb-6">
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="bg-transparent p-0 h-auto gap-0 flex-wrap">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                data-ocid="feed.category_filter.tab"
                className="rounded-none px-4 py-2 text-sm tracking-wide font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground border-b-2 data-[state=active]:border-primary data-[state=inactive]:border-transparent"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="container max-w-7xl mx-auto px-4 pb-16">
        {isLoading && (
          <div data-ocid="feed.loading_state">
            <Skeleton className="w-full h-[480px] rounded-none mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SKELETON_KEYS.map((key) => (
                <ArticleSkeleton key={key} />
              ))}
            </div>
          </div>
        )}

        {isError && (
          <div className="text-center py-16" data-ocid="feed.error_state">
            <p className="text-destructive font-semibold">
              Failed to load articles. Please try again.
            </p>
          </div>
        )}

        {!isLoading && !isError && articles.length === 0 && (
          <div className="text-center py-24" data-ocid="feed.empty_state">
            <Rss className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">
              No stories found
            </h3>
            <p className="text-muted-foreground">
              {debouncedSearch
                ? `No articles matching "${debouncedSearch}"`
                : "No articles in this category yet."}
            </p>
          </div>
        )}

        {!isLoading && !isError && articles.length > 0 && (
          <div data-ocid="feed.list">
            {heroArticle && (
              <div className="mb-10">
                <ArticleCard
                  article={heroArticle}
                  index={1}
                  isHero
                  onClick={() =>
                    navigate({
                      to: "/article/$id",
                      params: { id: heroArticle.id.toString() },
                    })
                  }
                />
              </div>
            )}

            {gridArticles.length > 0 && (
              <>
                <div className="ink-divider mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridArticles.map((article, i) => (
                    <ArticleCard
                      key={article.id.toString()}
                      article={article}
                      index={i + 2}
                      onClick={() =>
                        navigate({
                          to: "/article/$id",
                          params: { id: article.id.toString() },
                        })
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
