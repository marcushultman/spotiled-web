import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import { Token } from "../src/spv2.ts";

export interface SpotifyTokensProps {
  tokens: Signal<Token[]>;
  selectedToken: Signal<Token | undefined>;
}

interface Profile extends Token {
  displayName: string;
  image?: string;
}

const PLAYING_IMG_SRC =
  "https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif";

export default function SpotifyTokens({ tokens, selectedToken }: SpotifyTokensProps) {
  const profiles = useSignal<Profile[]>([]);

  const lookupProfiles = (tokens: Token[]) =>
    Promise.all(
      tokens.map(async (token): Promise<Profile> => {
        const res = await fetch("https://api.spotify.com/v1/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token.access_token}` },
        });
        const { display_name: displayName = "", images: [{ url: image } = {}] } = await res.json();
        return { ...token, displayName, image };
      }),
    );

  useSignalEffect(() => {
    lookupProfiles(tokens.value).then((p) => profiles.value = p);
  });

  const onSelect = (token: Token) => {
    selectedToken.value = selectedToken.value?.access_token === token.access_token
      ? undefined
      : token;
  };

  return (
    <div class="py-2 flex flex-col">
      <div className="flex flex-col gap-2">
        {profiles.value.map(({ displayName, image, ...token }) => (
          <div
            className="flex items-center gap-2"
            onClick={() => onSelect(token)}
          >
            <img className="w-10 h-10 rounded-full" src={image} />
            <span className="flex-1">{displayName}</span>
            {token.nowPlaying?.isPlaying ? <img className="w-5 h-5" src={PLAYING_IMG_SRC} /> : null}
          </div>
        ))}
      </div>
      <div className="bg-gray-200 w-full h-0.5 mt-2" />
    </div>
  );
}
