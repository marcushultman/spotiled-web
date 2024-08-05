export interface DeviceCode {
  expiry: number;
  interval: number;
  device_code: string;
  user_code: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  nowPlaying?: {
    id: string;
    lengths: [number, number][];
    isPlaying: boolean;
  };
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
