import { Handlers } from "$fresh/server.ts";
import { encode } from "$std/encoding/base64.ts";
import { assert } from "https://deno.land/std@0.216.0/assert/assert.ts";
import { makeDisplay } from "../../src/rendering.ts";
import { decodeServiceRequest, Display, encodeState, makeResponse } from "../../src/state.ts";
import { Behavior } from "../../src/state.ts";

const CLIENT_ID = Deno.env.get("SPOTIFY_CLIENT_ID");
const CLIENT_SECRET = Deno.env.get("SPOTIFY_CLIENT_SECRET");

assert(CLIENT_ID);
assert(CLIENT_SECRET);

const AUTH_DEVICE_CODE_URL = "https://accounts.spotify.com/api/device/code";
const AUTH_TOKEN_URL = "https://accounts.spotify.com/api/token";
const PLAYER_URL = "https://api.spotify.com/v1/me/player?additional_types=track,episode";
const SCANNABLES_CDN_URL = "https://scannables.scdn.co/uri/plain/svg/000000/white/400/";
const AUDIO_FEATURES_URL = "https://api.spotify.com/v1/audio-features/";

const XWWW_FORM_URL_ENCODED = "application/x-www-form-urlencoded";

interface DeviceCode {
  expiry: number;
  interval: number;
  device_code: string;
  user_code: string;
}

interface Token {
  access_token: string;
  refresh_token: string;
  nowPlaying?: {
    id: string;
    lengths: [number, number][];
  };
}

type TokenData = { error: string } & Token;

interface SPv2Data {
  auth?: { deviceCode?: DeviceCode };
  tokens?: Token[];
  numRequests?: number;
  lastRequestAt?: number;
}

function makeSpv2Response(data?: SPv2Data, display?: Display, behavior?: Behavior) {
  return makeResponse({ "led/spv2": encodeState(data, display, behavior) });
}

//

class AuthorizationPendingError extends Error {
  constructor(public deviceCode: DeviceCode) {
    super();
  }
}

async function requestDeviceCode(): Promise<DeviceCode> {
  const res = await fetch(AUTH_DEVICE_CODE_URL, {
    method: "POST",
    headers: { "content-type": XWWW_FORM_URL_ENCODED },
    body: `client_id=${CLIENT_ID}&scope=user-read-playback-state&description=Spotify-LED`,
  });

  if (!res.ok) {
    throw new Error("failed to get device_code");
  }

  interface DeviceFlowData {
    device_code: string;
    user_code: string;
    expires_in: number;
    verification_url: string;
    verification_url_prefilled: string;
    interval: number;
  }
  const data: DeviceFlowData = await res.json();
  console.info("url:", data.verification_url_prefilled);

  return {
    expiry: Date.now() + data.expires_in * 1000,
    interval: data.interval,
    device_code: data.device_code,
    user_code: data.user_code,
  };
}

async function pollToken(deviceCode: DeviceCode): Promise<Token> {
  const response = await fetch(AUTH_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": XWWW_FORM_URL_ENCODED },
    body:
      `client_id=${CLIENT_ID}&device_code=${deviceCode.device_code}&scope=user-read-playback-state&grant_type=urn:ietf:params:oauth:grant-type:device_code`,
  });

  if (response.status / 100 == 5) {
    throw new Error("failed to get auth_code or error");
  }

  const { error, access_token, refresh_token }: TokenData = await response.json();

  if (error == "authorization_pending") {
    throw new AuthorizationPendingError(deviceCode);
  } else if (error) {
    throw new Error(`auth_code error: ${error}`);
  }

  console.info(
    `access_token: ${access_token.slice(0, 8)},`,
    `refresh_token:${refresh_token.slice(0, 8)}`,
  );

  return { access_token, refresh_token };
}

async function authenticate(data: SPv2Data) {
  try {
    let { deviceCode } = data.auth ?? {};

    if (!deviceCode || Date.now() >= deviceCode.expiry) {
      deviceCode = await requestDeviceCode();
      data.auth = { deviceCode };
    }
    data.tokens = [await pollToken(deviceCode), ...data.tokens ?? []];
  } catch (e: unknown) {
    if (e instanceof AuthorizationPendingError) {
      console.log("authorization_pending");
      return makeSpv2Response(
        data,
        {
          logo: encode(new Uint8Array([0xFF, 0xFF, 0xFF])),
          bytes: makeDisplay((ctx) => {
            ctx.fillStyle = "red";
            ctx.fillRect(0, 0, 1, 1);

            ctx.scale(0.5, 1);
            ctx.fillStyle = "white";
            ctx.font = "16px monospace";
            ctx.fillText(e.deviceCode.user_code, 3 / 0.5, 14);
          }),
        },
        { poll: e.deviceCode.interval * 1000 },
      );
    }
    console.error(e instanceof Error ? e.message : `Unknown error: ${e}`);
    return makeSpv2Response({ ...data, auth: {} }, undefined, { poll: 5000 });
  }
  delete data.auth;
}

type OnRetryAfter = (retryAfter: number) => void;

class DidLogoutError extends Error {}

async function refreshToken(token: Token, onRetryAfter: OnRetryAfter) {
  const res = await fetch(AUTH_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": XWWW_FORM_URL_ENCODED },
    body:
      `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&refresh_token=${token.refresh_token}&grant_type=refresh_token`,
  });

  if (!res.ok) {
    return new DidLogoutError();
  }

  const { access_token, refresh_token }: TokenData = await res.json();
  token.access_token = access_token;
  token.refresh_token = refresh_token;

  return requestNowPlaying(token, onRetryAfter, true);
}

async function requestNowPlaying(
  token: Token,
  onRetryAfter: OnRetryAfter,
  disableRetry = false,
): Promise<Display | DidLogoutError | undefined> {
  const res = await fetch(PLAYER_URL, {
    headers: { authorization: `Bearer ${token.access_token}` },
  });

  if (!res.ok) {
    if (res.status == 429 || res.status == 503) {
      console.error(`fetch now playing rate limited (${res.status})`);
      const retryAfter = res.headers.get("retry-after");
      onRetryAfter((retryAfter ? parseInt(retryAfter) : 60) * 1000);
      return;
    }
    if (!disableRetry) {
      console.error(`fetch now playing failed with status ${res.status}`);
      return refreshToken(token, onRetryAfter);
    }
    return;
  }

  if (res.status == 204) {
    console.log("nothing is playing (204)");
    return;
  }

  interface NowPlaying {
    item: {
      id: string;
      uri: string;
    };
    is_playing: boolean;
  }
  const { item: { id, uri }, is_playing }: NowPlaying = await res.json();

  if (!is_playing) {
    console.log("paused");
    return;
  }

  const displayFromLengths = (lengths: [number, number][]) => {
    console.log(token.access_token.slice(0, 8), "now playing", uri);
    return ({
      logo: encode(new Uint8Array([0xFF, 0xFF, 0xFF])),
      bytes: makeDisplay((ctx) => {
        ctx.fillStyle = "white";
        lengths.forEach(([l0, l1], x) => ctx.fillRect(x, 8 - l0, 1, l0 + l1));
      }),
    });
  };

  if (token.nowPlaying?.id === id) {
    return displayFromLengths(token.nowPlaying.lengths);
  }

  console.log(token.access_token.slice(0, 8), "fetch scannable", uri);
  const [res1] = await Promise.all([
    fetch(`${SCANNABLES_CDN_URL}${uri}?format=svg`),
    // fetch(AUDIO_FEATURES_URL + id, {
    //   headers: { authorization: `Bearer ${token.access_token}` },
    // }),
  ]);

  const svgData = await res1.text();
  const lengths = svgData.split("\n").slice(2, 25)
    .map((line): [number, number] => {
      const match = line.match(/y=\"(\d+).*height=\"(\d+)/);
      const [a, b] = match?.slice(1, 3).map((s) => parseInt(s)) ?? [];
      const LENGTHS: Record<number, number> = {
        ...{ 11: 1, 18: 2, 25: 3, 32: 4, 39: 5, 46: 6, 53: 7, 60: 8 },
        ...{ 44: 1, 41: 2, 37: 3, 34: 4, 30: 5, 27: 6, 23: 7, 20: 8 },
      };
      return [LENGTHS[a], LENGTHS[b]];
    });

  token.nowPlaying = { id, lengths };
  return displayFromLengths(lengths);
}

function isLikelyToPlay() {
  const now = new Date();
  const wday = (now.getDay() + 6) % 8; // days since Monday [0-6]
  const hour = now.getHours();

  return wday < 5
    ? (hour >= 6 && hour <= 9) || (hour > 15 && hour <= 22) // Mon - Fri
    : (hour >= 8 && hour <= 23); // Weekend
}

// backoff 10s -> ~5min
function requestBackoff(numRequest: number) {
  const maxFactor = isLikelyToPlay() ? 6 : 32;
  return 10000 * Math.floor(Math.min(1 << Math.max(numRequest, 1) - 1, maxFactor));
}

export const handler: Handlers = {
  async POST(req, _) {
    const url = new URL(req.url);
    const { data } = await decodeServiceRequest<SPv2Data>(req, {});

    if (data.auth || url.searchParams.has("auth")) {
      const res = await authenticate(data);
      if (res) {
        return res;
      }
    }

    if (data.lastRequestAt && Date.now() >= data.lastRequestAt + 36001000) {
      data.numRequests = 0;
    }
    data.lastRequestAt = Date.now();

    let poll = requestBackoff(data.numRequests ?? 0);

    for (let i = 0; data.tokens && i < data.tokens.length; ++i) {
      const token = data.tokens[i];
      const result = await requestNowPlaying(
        token,
        (retryAfter) => poll = Math.max(poll, retryAfter),
      );
      if (result instanceof DidLogoutError) {
        console.warn(token.access_token.slice(0, 8), "logged out");
        data.tokens.splice(i, 1);
      } else if (result) {
        // Re-order tokens
        data.tokens.unshift(...data.tokens.splice(i, 1));
        data.numRequests = 0;
        return makeSpv2Response(data, result, { poll: 5000 });
      }
    }

    console.info("nothing is playing, retry in:", Math.floor(poll / 1000), "s");
    data.numRequests = Math.min((data.numRequests ?? 0) + 1, 31);
    return makeSpv2Response(data, undefined, { poll });
  },
};
