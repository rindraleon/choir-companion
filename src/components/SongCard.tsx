import { Heart, Music } from "lucide-react";
import { Song } from "@/types/song";
import { cn } from "@/lib/utils";

interface SongCardProps {
  song: Song;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClick: () => void;
}

export function SongCard({ song, isFavorite, onToggleFavorite, onClick }: SongCardProps) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all cursor-pointer active:scale-[0.98]"
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
        <Music className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">
          {String(song.id).padStart(3, "0")} — {song.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {song.category} • {song.author}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(song.id);
        }}
        className="p-2 rounded-full hover:bg-secondary transition-colors shrink-0"
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            isFavorite ? "fill-primary text-primary" : "text-muted-foreground"
          )}
        />
      </button>
    </div>
  );
}
