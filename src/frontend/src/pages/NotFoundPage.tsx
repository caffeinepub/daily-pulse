import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-display text-8xl font-bold text-primary mb-4">404</p>
      <h1 className="font-display text-2xl font-bold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/">
        <Button className="rounded-none bg-primary text-primary-foreground">
          Back to Home
        </Button>
      </Link>
    </main>
  );
}
