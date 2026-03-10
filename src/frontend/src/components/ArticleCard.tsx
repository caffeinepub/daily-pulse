import { motion } from "motion/react";
import type { Article } from "../backend.d";

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

function getPlaceholderGradient(id: bigint): string {
  return PLACEHOLDER_GRADIENTS[Number(id) % PLACEHOLDER_GRADIENTS.length];
}

interface ArticleCardProps {
  article: Article;
  index: number;
  onClick: () => void;
  isHero?: boolean;
}

export function ArticleCard({
  article,
  index,
  onClick,
  isHero = false,
}: ArticleCardProps) {
  if (isHero) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="article-card cursor-pointer group relative overflow-hidden"
        onClick={onClick}
        data-ocid={`feed.item.${index}`}
      >
        <div className="relative h-[480px] md:h-[560px] overflow-hidden">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${getPlaceholderGradient(article.id)} transition-transform duration-500 group-hover:scale-105`}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest ${getCategoryStyle(article.category)} mb-3`}
            >
              {article.category}
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-3 line-clamp-3">
              {article.title}
            </h2>
            <p className="text-white/80 text-base md:text-lg line-clamp-2 mb-4 max-w-2xl">
              {article.summary}
            </p>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span className="font-semibold text-white/80">
                {article.author}
              </span>
              <span>·</span>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="article-card cursor-pointer group flex flex-col"
      onClick={onClick}
      data-ocid={`feed.item.${index}`}
    >
      <div className="relative h-48 overflow-hidden">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${getPlaceholderGradient(article.id)}`}
          />
        )}
        <span
          className={`absolute top-3 left-3 inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${getCategoryStyle(article.category)}`}
        >
          {article.category}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-lg font-bold leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-3">
          {article.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 flex-1 mb-3">
          {article.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
          <span className="font-semibold truncate">{article.author}</span>
          <span className="shrink-0 ml-2">
            {formatDate(article.publishedAt)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
