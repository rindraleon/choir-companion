export interface Song {
  id: number;
  title: string;
  lyrics: string;
  author: string;
  year: number;
  category: string;
}

export interface SongData {
  songs: Song[];
}
