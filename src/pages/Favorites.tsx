import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { getSongs, getFavorites, toggleFavorite } from "@/lib/songStorage";
import { SongCard } from "@/components/SongCard";

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(getFavorites());
  const songs = getSongs();
  const favSongs = songs.filter((s) => favorites.includes(s.id));

  const handleToggleFavorite = (id: number) => {
    setFavorites(toggleFavorite(id));
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b px-5 pt-4 pb-3">
        <h1 className="text-lg font-bold text-foreground">Hira tiana</h1>
      </div>

      <div className="px-4 py-3 space-y-2">
        {favSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Heart className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">Tsy mbola misy hira tiana</p>
            <p className="text-xs mt-1">Tsindrio ny ❤️ mba hanampy hira</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-2">{favSongs.length} hira tiana</p>
            {favSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
                onClick={() => navigate(`/song/${song.id}`)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
