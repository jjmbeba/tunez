export interface Station {
  id: string;
  name: string;
  streamUrl: string;
  homepage: string;
  favicon: string;
  votes: number;
  codec: string;
  bitrate: number;
  clickCount: number;
  tags: string[];
  countryCode: string;
  language: string;
}
