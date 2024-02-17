import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export interface SpotifyTokensProps {}

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
  image?: string;
}

export default function SpotifyTokens(props: SpotifyTokensProps) {
  const arr = useSignal<Foo[]>([]);

  const update = () =>
    fetch("/spotify/tokens").then(async (res) => {
      const { tokens }: Response = await res.json();
      arr.value = await Promise.all(tokens.map(async ({ accessToken, ...props }): Promise<Foo> => {
        const res = await fetch("https://api.spotify.com/v1/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const {
          display_name: displayName = "",
          images: [{ url: image = undefined } = {}],
        } = await res.json();
        return { displayName, image, ...props };
      }));
    });

  useEffect(() => {
    update();
  }, []);

  return (
    <div class="py-2 flex flex-col">
      <h1 className="self-center text-lg pb-2">Spotify users</h1>
      <div className="flex flex-col gap-2">
        {arr.value.map(({ displayName, isPlaying, image }) => (
          <div className="flex items-center gap-2">
            <img className="w-10 h-10 rounded-full" src={image} />
            <span className="flex-1">{displayName}</span>
            {isPlaying
              ? (
                <img
                  className="w-5 h-5"
                  src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif"
                />
              )
              : null}
          </div>
        ))}
      </div>
    </div>
  );
}
