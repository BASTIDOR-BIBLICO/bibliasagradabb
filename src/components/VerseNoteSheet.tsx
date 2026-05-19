import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { devotionalsService } from "@/lib/supabase-stub";
import { devotionalStore } from "@/lib/devotionals/storage";
import { useAuth } from "@/hooks/useAuth";
import { Trash2, Lock } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number | null;
  verseText: string;
}

export function VerseNoteSheet({ open, onOpenChange, bookId, bookName, chapter, verse, verseText }: Props) {
  const [note, setNote] = useState("");
  const existing = verse != null ? devotionalStore.forVerse(bookId, chapter, verse) : undefined;
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setNote(existing?.note ?? "");
  }, [existing?.id, verse, open]);

  if (verse == null) return null;

  const goLogin = () => {
    onOpenChange(false);
    navigate({ to: "/login", search: { redirect: location.href } });
  };

  const handleSave = async () => {
    if (!note.trim()) return;
    if (!user) {
      goLogin();
      return;
    }
    await devotionalsService.upsert({
      id: existing?.id,
      bookId,
      bookName,
      chapter,
      verse,
      verseText,
      note: note.trim(),
    });
    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (!existing) return;
    if (!user) {
      goLogin();
      return;
    }
    await devotionalsService.remove(existing.id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl sm:max-w-lg sm:mx-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="font-serif text-xl">
            {bookName} {chapter}:{verse}
          </SheetTitle>
          <SheetDescription className="font-serif italic text-foreground/80 leading-relaxed">
            "{verseText}"
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 space-y-3">
          <label className="text-sm font-medium text-muted-foreground">
            Sua nota devocional
          </label>
          {!loading && !user && (
            <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Para salvar sua reflexão, faça{" "}
                <button onClick={goLogin} className="font-medium text-primary underline-offset-2 hover:underline">
                  login ou crie sua conta
                </button>
                .
              </span>
            </div>
          )}
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="O que este versículo fala ao seu coração hoje?"
            className="min-h-[160px] resize-none font-serif text-base leading-relaxed"
            autoFocus
          />
          <div className="flex items-center justify-between gap-3 pt-2">
            {existing ? (
              <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
                <Trash2 className="mr-1.5 h-4 w-4" /> Excluir
              </Button>
            ) : <span />}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={!note.trim()}>
                {user ? "Salvar" : "Entrar para salvar"}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
