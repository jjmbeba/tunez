export interface Artist {
  name: string;
  mbid: string;
  bio: string;
  image: string;
  listeners: number;
  playcount: number;
  similar: string[];
  tags: string[];
}

export interface ArtistBrief {
  name: string;
  image: string;
  url: string;
}

export interface Album {
  id: string;
  title: string;
  type: "Album" | "Single" | "EP" | "Compilation" | string;
  releaseYear: number | null;
}
