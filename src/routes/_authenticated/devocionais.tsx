import { createFileRoute } from "@tanstack/react-router";
// Re-export route under new path. File preserved for routing.
import DevotionalsPageBase from "./_devocionais-impl";

export const Route = createFileRoute("/_authenticated/devocionais")({
  component: DevotionalsPageBase,
  head: () => ({ meta: [{ title: "Meus Devocionais — Lectio" }] }),
});
