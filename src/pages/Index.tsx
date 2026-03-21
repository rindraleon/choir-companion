import { Music, Heart, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSongs, getFavorites, getLastSync } from "@/lib/songStorage";
import { SyncButton } from "@/components/SyncButton";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [, setTick] = useState(0);
  const songs = getSongs();
  const favorites = getFavorites();
  const lastSync = getLastSync();
  const categories = [...new Set(songs.map((s) => s.category))];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5 px-5 pt-12 pb-8">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-foreground text-center" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Chorale Antsan'ny Fitia
          </h1>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Paroasy Md François d'Assise <br />
            Tsararivotra Ambalavao
          </p>


          {/* <p className="text-sm text-muted-foreground mt-1">
            Hiran'ny Chorale — {songs.length} hira
          </p> */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <SyncButton onSynced={() => setTick((t) => t + 1)} />
            {lastSync && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(lastSync).toLocaleDateString("fr-FR")}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Verser bublique */}
      <div className="px-5 mt-4 mb-10">
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-sm text-center text-muted-foreground italic">
            "Mba handefa feo fiderana, ary hitantara ny asanao mahagaga rehetra."
          </p>
          <p className="text-[10px] text-right mt-1 text-muted-foreground">
            — Salamo 26:7
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 -mt-4">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => navigate("/songs")}
            className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all"
          >
            <Music className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">{songs.length}</span>
            <span className="text-[10px] text-muted-foreground">Chansons</span>
          </button>
          <button
            onClick={() => navigate("/favorites")}
            className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all"
          >
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">{favorites.length}</span>
            <span className="text-[10px] text-muted-foreground">Favoris</span>
          </button>
          <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-card border border-border/50">
            <Music className="h-6 w-6 text-accent" />
            <span className="text-lg font-bold text-foreground">{categories.length}</span>
            <span className="text-[10px] text-muted-foreground">Catégories</span>
          </div>
        </div>
      </div>
      

      {/* Categories */}
      <div className="px-5 mt-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Sokajy (Catégories)</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => navigate(`/songs?category=${encodeURIComponent(cat)}`)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {cat} ({songs.filter((s) => s.category === cat).length})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
