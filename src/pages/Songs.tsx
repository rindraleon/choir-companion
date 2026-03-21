import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getSongs, getFavorites, toggleFavorite } from "@/lib/songStorage";
import { SongCard } from "@/components/SongCard";
import { CategoryFilter } from "@/components/CategoryFilter";

const Songs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [favorites, setFavorites] = useState(getFavorites());
  const songs = getSongs();

  const categories = useMemo(() => [...new Set(songs.map((s) => s.category))].sort(), [songs]);

  const filtered = useMemo(
    () => (selectedCategory ? songs.filter((s) => s.category === selectedCategory) : songs),
    [songs, selectedCategory]
  );

  const handleToggleFavorite = (id: number) => {
    setFavorites(toggleFavorite(id));
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b px-5 pt-4 pb-3">
        <h1 className="text-lg font-bold text-foreground mb-3">Hira rehetra (Tous les chansons)</h1>
        <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      <div className="px-4 py-3 space-y-2">
        <p className="text-xs text-muted-foreground mb-2">{filtered.length} hira</p>
        {filtered.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            isFavorite={favorites.includes(song.id)}
            onToggleFavorite={handleToggleFavorite}
            onClick={() => navigate(`/song/${song.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Songs;
