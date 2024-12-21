import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import { Token } from "../src/spv2.ts";

export interface SpotifyTokensProps {
  tokens: Signal<Token[]>;
}

interface Profile {
  displayName: string;
  image?: string;
  isPlaying: boolean;
}

const PLAYING_IMG_SRC =
  "https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif";

export default function SpotifyTokens({ tokens }: SpotifyTokensProps) {
  const profiles = useSignal<Profile[]>([]);

  const lookupProfiles = (tokens: Token[]) =>
    Promise.all(
      tokens.map(async ({ access_token, nowPlaying }): Promise<Profile> => {
        const res = await fetch("https://api.spotify.com/v1/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const { display_name: displayName = "", images: [{ url: image } = {}] } = await res.json();
        return { displayName, image, isPlaying: !!nowPlaying?.isPlaying };
      }),
    );

  useSignalEffect(() => {
    lookupProfiles(tokens.value).then((p) => profiles.value = p);
  });

  return (
    <div class="py-2 flex flex-col">
      <h1 className="self-center text-lg pb-2">Spotify users</h1>
      <div className="flex flex-col gap-2">
        {profiles.value.map(({ displayName, isPlaying, image }) => (
          <div className="flex items-center gap-2">
            <img className="w-10 h-10 rounded-full" src={image} />
            <span className="flex-1">{displayName}</span>
            {isPlaying ? <img className="w-5 h-5" src={PLAYING_IMG_SRC} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
