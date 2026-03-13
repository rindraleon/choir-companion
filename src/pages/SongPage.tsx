import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Heart, Copy, Share2, Play, Pause, Minus, Plus } from "lucide-react";
import { getSongs, isFavorite, toggleFavorite, getFontSize, setFontSize as saveFontSize, addRecentSong } from "@/lib/songStorage";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const SongPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const songs = getSongs();
  const song = songs.find((s) => s.id === Number(id));

  const [fav, setFav] = useState(() => isFavorite(Number(id)));
  const [fontSize, setFontSizeState] = useState(getFontSize);
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(30);
  const lyricsRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (id) addRecentSong(Number(id));
  }, [id]);

  useEffect(() => {
    if (autoScroll && lyricsRef.current) {
      scrollInterval.current = setInterval(() => {
        window.scrollBy({ top: 1, behavior: "auto" });
      }, 100 - scrollSpeed);
    }
    return () => {
      if (scrollInterval.current) clearInterval(scrollInterval.current);
    };
  }, [autoScroll, scrollSpeed]);

  if (!song) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Hira tsy hita</p>
      </div>
    );
  }

  const handleFontChange = (delta: number) => {
    const newSize = Math.min(32, Math.max(12, fontSize + delta));
    setFontSizeState(newSize);
    saveFontSize(newSize);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${song.title}\n\n${song.lyrics}`);
    toast({ title: "📋 Copié !" });
  };

  const handleShare = async () => {
    const text = `${song.title}\n\n${song.lyrics}\n\n— ${song.author}`;
    if (navigator.share) {
      await navigator.share({ title: song.title, text });
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: "📤 Copié pour partage !" });
    }
  };

  const handleToggleFav = () => {
    toggleFavorite(song.id);
    setFav(!fav);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b">
        <div className="flex items-center gap-2 px-3 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-foreground">{song.title}</p>
            <p className="text-[10px] text-muted-foreground">{song.category} • {song.author}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleToggleFav}>
            <Heart className={cn("h-5 w-5", fav && "fill-primary text-primary")} />
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 px-3 pb-2 overflow-x-auto">
          <Button variant="outline" size="sm" onClick={() => handleFontChange(-2)} className="shrink-0">
            <Minus className="h-3 w-3" /><span className="text-xs ml-0.5">A</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleFontChange(2)} className="shrink-0">
            <Plus className="h-3 w-3" /><span className="text-xs ml-0.5">A</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy} className="shrink-0">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="shrink-0">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={autoScroll ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoScroll(!autoScroll)}
            className="shrink-0"
          >
            {autoScroll ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </Button>
          {autoScroll && (
            <div className="flex items-center gap-2 min-w-[100px] shrink-0">
              <Slider
                value={[scrollSpeed]}
                onValueChange={([v]) => setScrollSpeed(v)}
                min={10}
                max={90}
                step={5}
                className="w-20"
              />
            </div>
          )}
        </div>
      </div>

      {/* Song number badge */}
      <div className="px-5 pt-4">
        <span className="inline-block px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">
          Hira {String(song.id).padStart(3, "0")}
        </span>
        {song.year && (
          <span className="ml-2 text-xs text-muted-foreground">{song.year}</span>
        )}
      </div>

      {/* Lyrics */}
      <div ref={lyricsRef} className="px-5 py-4">
        <pre
          className="whitespace-pre-wrap font-sans leading-relaxed text-foreground"
          style={{ fontSize: `${fontSize}px` }}
        >
          {song.lyrics}
        </pre>
      </div>
    </div>
  );
};

export default SongPage;
