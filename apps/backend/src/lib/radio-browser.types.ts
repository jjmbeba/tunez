export interface RadioBrowserStation {
  changeuuid: string;
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  languagecodes: string;
  votes: number;
  codec: string;
  bitrate: number;
  hls: 0 | 1;
  lastcheckok: 0 | 1;
  clickcount: number;
  clicktrend: number;
  geo_lat: number | null;
  geo_long: number | null;
  has_extended_info: boolean;
}
