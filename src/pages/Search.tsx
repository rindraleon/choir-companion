import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";
import { getSongs, getFavorites, toggleFavorite } from "@/lib/songStorage";
import { SongCard } from "@/components/SongCard";
import { Input } from "@/components/ui/input";

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState(getFavorites());
  const songs = getSongs();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.lyrics.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q)
    );
  }, [query, songs]);

  const handleToggleFavorite = (id: number) => {
    setFavorites(toggleFavorite(id));
  };

  const highlightText = (text: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-accent/30 text-accent-foreground rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b px-5 pt-4 pb-3">
        <h1 className="text-lg font-bold text-foreground mb-3">Hikaroka hira</h1>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Titre, paroles, catégorie, auteur..."
            className="pl-10 pr-10"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-3 space-y-2">
        {query.trim() && (
          <p className="text-xs text-muted-foreground mb-2">
            {results.length} résultat{results.length !== 1 ? "s" : ""}
          </p>
        )}
        {!query.trim() && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <SearchIcon className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">Tapez pour rechercher un hira</p>
          </div>
        )}
        {results.map((song) => (
          <div key={song.id}>
            <SongCard
              song={song}
              isFavorite={favorites.includes(song.id)}
              onToggleFavorite={handleToggleFavorite}
              onClick={() => navigate(`/song/${song.id}`)}
            />
            {query.trim() && song.lyrics.toLowerCase().includes(query.toLowerCase()) && (
              <div className="ml-13 px-3 py-1.5 text-xs text-muted-foreground bg-muted/50 rounded-b-lg -mt-1 border-x border-b border-border/30">
                ...{highlightText(
                  song.lyrics
                    .split("\n")
                    .find((l) => l.toLowerCase().includes(query.toLowerCase())) || ""
                )}...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
