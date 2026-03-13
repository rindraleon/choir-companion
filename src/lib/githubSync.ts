import { Song, SongData } from "@/types/song";
import { setSongs, setLastSync } from "@/lib/songStorage";

const RAW_URL =
  "https://raw.githubusercontent.com/rindraleon/Antsan-ny-fitia/main/Antsan'ny%20fitia.json";

export async function fetchSongsFromGitHub(): Promise<Song[]> {
  const response = await fetch(RAW_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch songs from GitHub");
  const data: SongData = await response.json();
  setSongs(data.songs);
  setLastSync(new Date().toISOString());
  return data.songs;
}
