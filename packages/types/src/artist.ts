export interface Artist {
  name: string;
  mbid: string;
  bio: string;
  url: string;
  image: string;
  listeners: number;
  playCount: number;
  similar: string[];
  tags: string[];
}

export interface ArtistBrief {
  name: string;
  image: string;
  url: string;
}

export interface ArtistSearchResult {
  name: string;
  mbid: string;
  url: string;
  image: string;
  listeners: number;
}

export interface Album {
  id: string;
  title: string;
  type: "Album" | "Single" | "EP" | "Compilation" | string;
  releaseYear: number | null;
  image: string;
}
