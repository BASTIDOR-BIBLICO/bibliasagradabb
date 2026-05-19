import { Link, useRouter } from "@tanstack/react-router";
import { BookOpen, NotebookPen, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/supabase-stub";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { useAuth } from "@/hooks/useAuth";

export function AppHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme, toggleTheme } = useReaderSettings();

  const handleLogout = async () => {
    await authService.signOut();
    router.navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-serif text-lg tracking-tight">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          <span>Bíblia Sagrada BB</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link to="/biblia">
              <BookOpen className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Bíblia</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/devocionais">
              <NotebookPen className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Devocionais</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          {user ? (
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sair">
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Entrar</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
