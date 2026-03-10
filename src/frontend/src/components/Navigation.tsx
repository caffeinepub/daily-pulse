import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import { LogIn, LogOut, Newspaper, Shield } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

export function Navigation() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const { data: isAdmin } = useIsAdmin();

  return (
    <header className="sticky top-0 z-50 bg-background border-b-2 border-foreground">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-sans tracking-widest uppercase">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                className="text-xs h-7 gap-1.5 text-muted-foreground hover:text-foreground"
                data-ocid="nav.login_button"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={login}
                disabled={loginStatus === "logging-in"}
                className="text-xs h-7 gap-1.5 text-muted-foreground hover:text-foreground"
                data-ocid="nav.login_button"
              >
                <LogIn className="w-3 h-3" />
                {loginStatus === "logging-in" ? "Signing in..." : "Sign In"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          data-ocid="nav.home_link"
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 bg-primary flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">
              Daily Pulse
            </span>
            <p className="text-xs text-muted-foreground tracking-widest uppercase leading-none">
              The world in focus
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <Link to="/" className="[&.active]:font-semibold">
            {({ isActive }) => (
              <Button
                variant="ghost"
                size="sm"
                className={`text-sm tracking-wide ${isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
              >
                Home
              </Button>
            )}
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              data-ocid="nav.admin_link"
              className="[&.active]:font-semibold"
            >
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-sm tracking-wide gap-1.5 ${isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Button>
              )}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
