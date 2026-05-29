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

export interface LastfmAlbum {
  name: string;
  mbid: string;
  url: string;
  image: LastfmImage[];
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
  playcount: string;
}

export interface LastfmTopAlbumsResponse {
  topalbums: {
    album: LastfmAlbum[];
  };
}

export interface LastfmSearchResponse {
  results: {
    "opensearch:Query": Record<string, string>;
    "opensearch:totalResults": string;
    "opensearch:startIndex": string;
    "opensearch:itemsPerPage": string;
    artistmatches: {
      artist: Array<{
        name: string;
        mbid: string;
        url: string;
        image: LastfmImage[];
        streamable: string;
        listeners: string;
      }>;
    };
    "@attr": {
      for: string;
    };
  };
}

export interface LastfmErrorResponse {
  error: number;
  message: string;
}
