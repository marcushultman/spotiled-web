import type { Signal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import { parseData, Token } from "../src/spv2.ts";

interface SpotifyAuthToggleProps {
  isAuthenticating: Signal<boolean>;
  tokens: Signal<Token[]>;
}

export default function SpotifyAuthToggle(props: SpotifyAuthToggleProps) {
  const [timeoutHandle, setTimeoutHandle] = useState<number>();

  const schedulePoll = () => {
    props.isAuthenticating.value
      ? setTimeoutHandle(setTimeout(poll, 3000))
      : clearTimeout(timeoutHandle);
  };
  const toggle = () => {
    props.isAuthenticating.value = !props.isAuthenticating.value;
    schedulePoll();
  };
  const poll = async () => {
    const res = await fetch("/led/spv2");
    const { auth, tokens } = parseData(await res.text());
    props.isAuthenticating.value = auth !== undefined;
    props.tokens.value = tokens ?? [];
    schedulePoll();
  };
  useEffect(schedulePoll, []);

  return (
    <form class="flex justify-center" method="POST" action={"/led/spv2?auth"} onSubmit={toggle}>
      <button type="submit" class="flex items-center gap-2 text-green-600">
        <img
          className="w-8 h-8"
          src={props.isAuthenticating.value
            ? "https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif"
            : "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"}
        />
        {props.isAuthenticating.value ? "Cancel" : "Login"}
      </button>
    </form>
  );
}
