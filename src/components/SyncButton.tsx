import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { fetchSongsFromGitHub } from "@/lib/githubSync";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SyncButtonProps {
  onSynced?: () => void;
}

export function SyncButton({ onSynced }: SyncButtonProps) {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetchSongsFromGitHub();
      toast({ title: "✅ Hira mis à jour", description: "Les chansons ont été synchronisées avec succès." });
      onSynced?.();
    } catch {
      toast({ title: "❌ Erreur", description: "Impossible de synchroniser. Vérifiez votre connexion.", variant: "destructive" });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Button onClick={handleSync} disabled={syncing} variant="outline" size="sm" className="gap-2">
      <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
      {syncing ? "Syncing..." : "Mettre à jour"}
    </Button>
  );
}
