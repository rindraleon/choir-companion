import { useState } from "react";
import { Lock, Plus, Trash2, Edit2, Download, Upload, Save, X } from "lucide-react";
import { getSongs, setSongs } from "@/lib/songStorage";
import { Song } from "@/types/song";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "antsanyfitia2025";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [songs, setSongsState] = useState(getSongs());
  const [editing, setEditing] = useState<Song | null>(null);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({ title: "", lyrics: "", author: "", category: "", year: new Date().getFullYear() });

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20 px-5">
        <div className="w-full max-w-sm space-y-4">
          <div className="text-center">
            <Lock className="h-10 w-10 mx-auto text-primary mb-3" />
            <h1 className="text-lg font-bold text-foreground">Accès administrateur</h1>
            <p className="text-xs text-muted-foreground mt-1">Entrez le mot de passe</p>
          </div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (password === ADMIN_PASSWORD) setAuthenticated(true);
                else toast({ title: "❌ Mot de passe incorrect", variant: "destructive" });
              }
            }}
          />
          <Button
            className="w-full"
            onClick={() => {
              if (password === ADMIN_PASSWORD) setAuthenticated(true);
              else toast({ title: "❌ Mot de passe incorrect", variant: "destructive" });
            }}
          >
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  const startCreate = () => {
    setForm({ title: "", lyrics: "", author: "", category: "", year: new Date().getFullYear() });
    setCreating(true);
    setEditing(null);
  };

  const startEdit = (song: Song) => {
    setForm({ title: song.title, lyrics: song.lyrics, author: song.author, category: song.category, year: song.year });
    setEditing(song);
    setCreating(false);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.lyrics.trim()) {
      toast({ title: "Titre et paroles requis", variant: "destructive" });
      return;
    }

    let updated: Song[];
    if (editing) {
      updated = songs.map((s) => (s.id === editing.id ? { ...s, ...form } : s));
    } else {
      const newId = Math.max(...songs.map((s) => s.id), 0) + 1;
      updated = [...songs, { id: newId, ...form }];
    }
    setSongs(updated);
    setSongsState(updated);
    setEditing(null);
    setCreating(false);
    toast({ title: editing ? "✅ Hira mis à jour" : "✅ Hira ajouté" });
  };

  const handleDelete = (id: number) => {
    const updated = songs.filter((s) => s.id !== id);
    setSongs(updated);
    setSongsState(updated);
    toast({ title: "🗑️ Hira supprimé" });
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ songs }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "antsany_fitia_backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.songs && Array.isArray(data.songs)) {
          const existingIds = new Set(songs.map((s) => s.id));
          const newSongs = data.songs.filter((s: Song) => !existingIds.has(s.id));
          const merged = [...songs, ...newSongs];
          setSongs(merged);
          setSongsState(merged);
          toast({ title: `✅ ${newSongs.length} hira importé(s)` });
        }
      } catch {
        toast({ title: "❌ Fichier invalide", variant: "destructive" });
      }
    };
    reader.readAsText(file);
  };

  const showForm = creating || editing;

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b px-5 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">Administration</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" />
            </Button>
            <label>
              <Button variant="outline" size="sm" asChild>
                <span><Upload className="h-3.5 w-3.5" /></span>
              </Button>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <Button size="sm" onClick={startCreate}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Nouveau
            </Button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="px-5 py-4 border-b bg-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">{editing ? "Modifier" : "Nouveau"} hira</h2>
            <Button variant="ghost" size="icon" onClick={() => { setEditing(null); setCreating(false); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <Input placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input placeholder="Catégorie" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input placeholder="Auteur" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            <Input type="number" placeholder="Année" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
            <Textarea
              placeholder="Paroles (utilisez des sauts de ligne)"
              value={form.lyrics}
              onChange={(e) => setForm({ ...form, lyrics: e.target.value })}
              rows={10}
            />
            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" /> Enregistrer
            </Button>
          </div>
        </div>
      )}

      <div className="px-4 py-3 space-y-2">
        <p className="text-xs text-muted-foreground">{songs.length} hira</p>
        {songs.map((song) => (
          <div key={song.id} className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border/50">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{String(song.id).padStart(3, "0")} — {song.title}</p>
              <p className="text-xs text-muted-foreground">{song.category} • {song.author}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => startEdit(song)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(song.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
