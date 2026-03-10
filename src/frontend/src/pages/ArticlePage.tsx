import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { motion } from "motion/react";
import { useGetArticle } from "../hooks/useQueries";

const CATEGORY_COLORS: Record<string, string> = {
  World: "bg-blue-700 text-white",
  Politics: "bg-amber-700 text-white",
  Technology: "bg-violet-700 text-white",
  Sports: "bg-green-700 text-white",
  Entertainment: "bg-pink-700 text-white",
  Science: "bg-teal-700 text-white",
};

function getCategoryStyle(category: string): string {
  return CATEGORY_COLORS[category] ?? "bg-foreground text-background";
}

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const PLACEHOLDER_GRADIENTS = [
  "from-slate-700 to-slate-900",
  "from-stone-700 to-stone-900",
  "from-zinc-700 to-zinc-900",
  "from-neutral-700 to-neutral-900",
];

const BODY_SKELETON_KEYS = [
  "bs1",
  "bs2",
  "bs3",
  "bs4",
  "bs5",
  "bs6",
  "bs7",
  "bs8",
];

function renderBodyParagraphs(body: string) {
  return body.split("\n").map((para, i) => {
    const key = `para-${i}`;
    return para.trim() ? <p key={key}>{para}</p> : <br key={key} />;
  });
}

export function ArticlePage() {
  const { id } = useParams({ from: "/article/$id" });
  const navigate = useNavigate();
  const articleId = BigInt(id);
  const { data: article, isLoading, isError } = useGetArticle(articleId);

  return (
    <main className="min-h-screen" data-ocid="article.panel">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/" })}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground -ml-2 rounded-none"
          data-ocid="article.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Button>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 rounded-none" />
            <Skeleton className="h-4 w-1/2 rounded-none" />
            <Skeleton className="w-full h-80 rounded-none" />
            <div className="space-y-2">
              {BODY_SKELETON_KEYS.map((key) => (
                <Skeleton key={key} className="h-4 w-full rounded-none" />
              ))}
            </div>
          </div>
        )}

        {isError && (
          <div className="text-center py-24">
            <p className="text-destructive font-semibold">
              Failed to load article.
            </p>
          </div>
        )}

        {!isLoading && !isError && !article && (
          <div className="text-center py-24">
            <p className="text-muted-foreground">Article not found.</p>
          </div>
        )}

        {!isLoading && !isError && article && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest ${getCategoryStyle(article.category)} mb-3`}
              >
                {article.category}
              </span>
            </div>

            <div className="ink-divider mb-6" />

            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6">
              {article.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed mb-6 font-display italic">
              {article.summary}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span className="font-semibold text-foreground">
                  {article.author}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>

            {article.imageUrl ? (
              <div className="mb-10 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full max-h-[500px] object-cover"
                />
              </div>
            ) : (
              <div
                className={`mb-10 w-full h-64 bg-gradient-to-br ${PLACEHOLDER_GRADIENTS[Number(article.id) % PLACEHOLDER_GRADIENTS.length]}`}
              />
            )}

            <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-foreground/90 prose-p:leading-relaxed">
              {renderBodyParagraphs(article.body)}
            </div>
          </motion.article>
        )}
      </div>
    </main>
  );
}
