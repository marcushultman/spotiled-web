import { type Signal, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface SpotifyTokensProps {
}

interface Token {
  accessToken: string;
  isPlaying: boolean;
  uri?: string;
}
interface Response {
  tokens: Token[];
}

interface Foo {
  displayName: string;
  isPlaying: boolean;
  uri?: string;
}

export default function SpotifyTokens(props: SpotifyTokensProps) {
  const arr = useSignal<Foo[]>([]);

  useEffect(() => {
    fetch("/spotify/tokens").then(async (res) => {
      const { tokens } = await res.json() as Response;
      arr.value = await Promise.all(tokens.map(async ({ accessToken, ...props }) => {
        const res = await fetch("https://api.spotify.com/v1/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const { display_name } = await res.json();
        return { displayName: display_name, ...props };
      }));
    });
  }, []);

  return (
    <div class="py-2">
      <h1>Tokens</h1>
      <div>
        {arr.value.map(({ displayName, isPlaying, uri }) => (
          <div>
            {isPlaying ? "🎵" : ""}
            {displayName}
          </div>
        ))}
      </div>
    </div>
  );
}
