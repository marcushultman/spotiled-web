import type { Signal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import { parseData, Token } from "../src/spv2.ts";
import { UserPlus } from "preact-feather";

const SPINNER_SRC = "https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif";

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
    <div class="flex gap-4 items-center mb-2">
      <img
        className="w-6 h-6"
        src={"https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"}
      />
      <div className="bg-gray-200 flex-1 h-0.5" />
      <form class="flex justify-center" method="POST" action={"/led/spv2?auth"} onSubmit={toggle}>
        <button type="submit">
          {props.isAuthenticating.value
            ? <img className="w-6 h-6" src={SPINNER_SRC} />
            : <UserPlus className="w-6 h-6" />}
        </button>
      </form>
    </div>
  );
}
