import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/admin/import")({
  component: AdminImportPage,
  head: () => ({ meta: [{ title: "Admin — Importar Bíblia" }] }),
});

const JFAA_URL =
  "https://raw.githubusercontent.com/damarals/biblias/master/inst/json/JFAA.json";
const CHUNK_SIZE = 500;

type JfaaBook = { abbrev: string; chapters: string[][] };
type VerseRow = { book_id: number; chapter: number; verse: number; text: string };

function flatten(data: JfaaBook[]): VerseRow[] {
  const rows: VerseRow[] = [];
  data.forEach((book, bIdx) => {
    const book_id = bIdx + 1; // ordem canônica protestante (1..66)
    book.chapters.forEach((chapter, cIdx) => {
      chapter.forEach((text, vIdx) => {
        rows.push({
          book_id,
          chapter: cIdx + 1,
          verse: vIdx + 1,
          text: String(text ?? "").trim(),
        });
      });
    });
  });
  return rows;
}

function AdminImportPage() {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [processed, setProcessed] = useState(0);
  const [total, setTotal] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pct = total > 0 ? Math.round((processed / total) * 100) : 0;

  const append = (line: string) => setLog((prev) => [...prev.slice(-50), line]);

  async function run() {
    setStatus("running");
    setProcessed(0);
    setTotal(0);
    setLog([]);
    setErrorMsg(null);

    try {
      append("Baixando JFAA.json…");
      const res = await fetch(JFAA_URL);
      if (!res.ok) throw new Error(`Fetch falhou: ${res.status}`);
      const data = (await res.json()) as JfaaBook[];
      append(`Recebidos ${data.length} livros. Achatando versículos…`);

      const rows = flatten(data);
      setTotal(rows.length);
      append(`Total de versículos: ${rows.length}. Enviando em lotes de ${CHUNK_SIZE}…`);

      for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
        const chunk = rows.slice(i, i + CHUNK_SIZE);
        const { error } = await supabase.from("verses").insert(chunk);
        if (error) throw new Error(`Lote ${i / CHUNK_SIZE + 1}: ${error.message}`);
        setProcessed(i + chunk.length);
      }

      append("Concluído com sucesso.");
      setStatus("done");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      append(`ERRO: ${msg}`);
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl">Importação da Bíblia (JFAA)</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Rota administrativa provisória. Baixa a versão JFAA (domínio público) e insere
          em <code className="rounded bg-muted px-1">verses</code> em lotes de {CHUNK_SIZE}.
        </p>
      </header>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <Button
          onClick={run}
          disabled={status === "running"}
          size="lg"
          className="w-full"
        >
          {status === "running"
            ? `Sincronizando… ${pct}%`
            : "Sincronizar Bíblia Completa (JFAA)"}
        </Button>

        <Progress value={pct} />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{processed.toLocaleString("pt-BR")} versículos enviados</span>
          <span>{total ? total.toLocaleString("pt-BR") : "—"} no total</span>
        </div>

        {status === "done" && (
          <p className="rounded-md bg-primary/10 p-3 text-sm text-primary">
            Importação concluída com sucesso.
          </p>
        )}
        {status === "error" && errorMsg && (
          <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {errorMsg}
          </p>
        )}

        {log.length > 0 && (
          <pre className="max-h-64 overflow-auto rounded-md bg-muted p-3 text-xs">
            {log.join("\n")}
          </pre>
        )}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Dica: se a tabela <code>verses</code> já tiver dados, limpe-a antes para evitar
        conflito de chave única.
      </p>
    </main>
  );
}
