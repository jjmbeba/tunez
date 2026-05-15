export interface LastfmImage {
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge" | "mega";
}

export interface LastfmArtist {
  name: string;
  mbid: string;
  url: string;
  image: LastfmImage[];
  streamable: string;
  stats: {
    listeners: string;
    plays: string;
  };
  similar: {
    artist: Array<{
      name: string;
      url: string;
      image: LastfmImage[];
    }>;
  };
  tags: {
    tag: Array<{
      name: string;
      url: string;
    }>;
  };
  bio: {
    published: string;
    summary: string;
    content: string;
  };
}

export interface LastfmSimilarArtists {
  similarartists: {
    artist: Array<{
      name: string;
      mbid: string;
      match: string;
      url: string;
      image: LastfmImage[];
      streamable: string;
    }>;
  };
}

export interface LastfmArtistResponse {
  artist: LastfmArtist;
}
export interface LastfmErrorResponse {
  error: number;
  message: string;
}
