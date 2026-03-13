import { Song } from "@/types/song";
import { defaultSongs } from "@/data/defaultSongs";

const SONGS_KEY = "antsany_fitia_songs";
const FAVORITES_KEY = "antsany_fitia_favorites";
const LAST_SYNC_KEY = "antsany_fitia_last_sync";
const FONT_SIZE_KEY = "antsany_fitia_font_size";
const RECENT_KEY = "antsany_fitia_recent";

export function getSongs(): Song[] {
  try {
    const stored = localStorage.getItem(SONGS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultSongs;
}

export function setSongs(songs: Song[]) {
  localStorage.setItem(SONGS_KEY, JSON.stringify(songs));
}

export function getFavorites(): number[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function toggleFavorite(songId: number): number[] {
  const favs = getFavorites();
  const idx = favs.indexOf(songId);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(songId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  return favs;
}

export function isFavorite(songId: number): boolean {
  return getFavorites().includes(songId);
}

export function getLastSync(): string | null {
  return localStorage.getItem(LAST_SYNC_KEY);
}

export function setLastSync(date: string) {
  localStorage.setItem(LAST_SYNC_KEY, date);
}

export function getFontSize(): number {
  try {
    const stored = localStorage.getItem(FONT_SIZE_KEY);
    if (stored) return parseInt(stored, 10);
  } catch {}
  return 16;
}

export function setFontSize(size: number) {
  localStorage.setItem(FONT_SIZE_KEY, String(size));
}

export function getRecentSongs(): number[] {
  try {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function addRecentSong(songId: number) {
  const recent = getRecentSongs().filter((id) => id !== songId);
  recent.unshift(songId);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 10)));
}
