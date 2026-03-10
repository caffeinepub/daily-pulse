import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, Pencil, Plus, Shield, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Article } from "../backend.d";
import { ArticleForm } from "../components/ArticleForm";
import {
  useCreateArticle,
  useDeleteArticle,
  useIsAdmin,
  useListArticles,
  useUpdateArticle,
} from "../hooks/useQueries";

type ViewMode = "list" | "create" | "edit";

const ADMIN_SKELETON_KEYS = ["as1", "as2", "as3", "as4", "as5"];

export function AdminPage() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { data: articles, isLoading } = useListArticles(null, null);
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();
  const deleteMutation = useDeleteArticle();

  const [mode, setMode] = useState<ViewMode>("list");
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  if (isAdminLoading) {
    return (
      <main className="container max-w-5xl mx-auto px-4 py-12">
        <Skeleton className="h-8 w-48 rounded-none mb-4" />
        <Skeleton className="h-64 w-full rounded-none" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="container max-w-5xl mx-auto px-4 py-24 text-center">
        <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">
          Admin Access Required
        </h2>
        <p className="text-muted-foreground">
          You must be signed in as an administrator to view this page.
        </p>
      </main>
    );
  }

  async function handleCreate(data: {
    title: string;
    summary: string;
    body: string;
    category: string;
    author: string;
    imageUrl: string;
  }) {
    await createMutation.mutateAsync(data);
    toast.success("Article created successfully");
    setMode("list");
  }

  async function handleUpdate(data: {
    title: string;
    summary: string;
    body: string;
    category: string;
    author: string;
    imageUrl: string;
  }) {
    if (!editingArticle) return;
    await updateMutation.mutateAsync({
      ...data,
      id: editingArticle.id,
      isPublished: editingArticle.isPublished,
    });
    toast.success("Article updated");
    setMode("list");
    setEditingArticle(null);
  }

  async function handleTogglePublished(article: Article) {
    await updateMutation.mutateAsync({
      id: article.id,
      title: article.title,
      summary: article.summary,
      body: article.body,
      category: article.category,
      author: article.author,
      imageUrl: article.imageUrl,
      isPublished: !article.isPublished,
    });
    toast.success(
      article.isPublished ? "Article unpublished" : "Article published",
    );
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    toast.success("Article deleted");
    setDeleteTarget(null);
  }

  return (
    <main className="min-h-screen">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="ink-divider mb-4" />
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
          </div>
          {mode === "list" && (
            <Button
              onClick={() => setMode("create")}
              className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              data-ocid="admin.create_button"
            >
              <Plus className="w-4 h-4" />
              New Article
            </Button>
          )}
          {mode !== "list" && (
            <Button
              variant="outline"
              className="rounded-none"
              onClick={() => {
                setMode("list");
                setEditingArticle(null);
              }}
            >
              ← Back to list
            </Button>
          )}
        </div>
        <div className="ink-divider-light mb-8" />

        <AnimatePresence mode="wait">
          {mode === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-display text-xl font-semibold mb-6">
                New Article
              </h2>
              <ArticleForm
                onSubmit={handleCreate}
                onCancel={() => setMode("list")}
                isPending={createMutation.isPending}
              />
            </motion.div>
          )}

          {mode === "edit" && editingArticle && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-display text-xl font-semibold mb-6">
                Edit: {editingArticle.title}
              </h2>
              <ArticleForm
                initial={editingArticle}
                onSubmit={handleUpdate}
                onCancel={() => {
                  setMode("list");
                  setEditingArticle(null);
                }}
                isPending={updateMutation.isPending}
              />
            </motion.div>
          )}

          {mode === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading && (
                <div className="space-y-3">
                  {ADMIN_SKELETON_KEYS.map((key) => (
                    <Skeleton key={key} className="h-16 w-full rounded-none" />
                  ))}
                </div>
              )}

              {!isLoading && (!articles || articles.length === 0) && (
                <div className="text-center py-16 border border-dashed border-border">
                  <p className="text-muted-foreground">
                    No articles yet. Create your first one!
                  </p>
                </div>
              )}

              {!isLoading && articles && articles.length > 0 && (
                <div className="space-y-0 border border-border divide-y divide-border">
                  {articles.map((article, i) => (
                    <motion.div
                      key={article.id.toString()}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-start gap-4 p-4 hover:bg-secondary/50 transition-colors"
                      data-ocid={`admin.article.item.${i + 1}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-sm truncate">
                            {article.title}
                          </h3>
                          <Badge
                            variant={
                              article.isPublished ? "default" : "secondary"
                            }
                            className="text-[10px] rounded-none shrink-0"
                          >
                            {article.isPublished ? "Published" : "Draft"}
                          </Badge>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {article.category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {article.summary}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          By {article.author}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div
                          className="flex items-center gap-1.5"
                          title={article.isPublished ? "Unpublish" : "Publish"}
                        >
                          {article.isPublished ? (
                            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                          <Switch
                            checked={article.isPublished}
                            onCheckedChange={() =>
                              handleTogglePublished(article)
                            }
                            className="scale-75"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-none"
                          onClick={() => {
                            setEditingArticle(article);
                            setMode("edit");
                          }}
                          data-ocid={`admin.article.edit_button.${i + 1}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive rounded-none"
                          onClick={() => setDeleteTarget(article)}
                          data-ocid={`admin.article.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Article?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <strong>"{deleteTarget?.title}"</strong>. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-none"
              data-ocid="admin.article.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              data-ocid="admin.article.confirm_button"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
