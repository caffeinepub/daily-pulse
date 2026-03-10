import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { Article } from "../backend.d";

const CATEGORIES = [
  "Work Orders",
  "MOU",
  "Capacity Additions",
  "Acquisitions",
  "Other",
];

interface ArticleFormProps {
  initial?: Article;
  onSubmit: (data: {
    title: string;
    summary: string;
    body: string;
    category: string;
    author: string;
    imageUrl: string;
  }) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
}

export function ArticleForm({
  initial,
  onSubmit,
  onCancel,
  isPending,
}: ArticleFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Work Orders");
  const [author, setAuthor] = useState(initial?.author ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (!summary.trim()) e.summary = "Summary is required";
    if (!body.trim()) e.body = "Body is required";
    if (!author.trim()) e.author = "Author is required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    await onSubmit({ title, summary, body, category, author, imageUrl });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-sm font-semibold">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry headline"
          data-ocid="article_form.title_input"
          className="rounded-none"
        />
        {errors.title && (
          <p
            className="text-destructive text-xs"
            data-ocid="article_form.title_error"
          >
            {errors.title}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="summary" className="text-sm font-semibold">
          Summary
        </Label>
        <Input
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Short summary"
          data-ocid="article_form.summary_input"
          className="rounded-none"
        />
        {errors.summary && (
          <p className="text-destructive text-xs">{errors.summary}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body" className="text-sm font-semibold">
          Body
        </Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Full content"
          rows={8}
          data-ocid="article_form.body_textarea"
          className="rounded-none resize-none"
        />
        {errors.body && (
          <p className="text-destructive text-xs">{errors.body}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              data-ocid="article_form.category_select"
              className="rounded-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="author" className="text-sm font-semibold">
            Author
          </Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author name"
            data-ocid="article_form.author_input"
            className="rounded-none"
          />
          {errors.author && (
            <p className="text-destructive text-xs">{errors.author}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="imageUrl" className="text-sm font-semibold">
          Image URL{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          data-ocid="article_form.image_input"
          className="rounded-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
          data-ocid="article_form.submit_button"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Saving..." : initial ? "Update Entry" : "Publish Entry"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-none"
          data-ocid="article_form.cancel_button"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
