export interface DeviceCode {
  expiry: number;
  interval: number;
  device_code: string;
  user_code: string;
}

export interface PlayState {
  id: string;
  lengths: [number, number][];
  isPlaying: boolean;
  tempo: number;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  nowPlaying?: PlayState;
}

export interface AudioFeatures {
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  type: "audio_features";
  id: string;
  uri: string;
  track_href: string;
  analysis_url: string;
  duration_ms: number;
  time_signature: number;
}

export interface SPv2Data {
  auth?: { deviceCode?: DeviceCode };
  tokens?: Token[];
  numRequests?: number;
  lastRequestAt?: number;
}

export function parseData(data?: string): SPv2Data {
  return data ? JSON.parse(atob(data)) : {};
}
