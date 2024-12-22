import type { Signal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import { DeviceCode, parseData, Token } from "../src/spv2.ts";
import { UserPlus } from "preact-feather";

const SPINNER_SRC = "https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif";
const SPOTIFY_ICON_SRC = "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg";

interface SpotifyAuthToggleProps {
  deviceCode: Signal<Partial<DeviceCode> | null>;
  tokens: Signal<Token[]>;
}

export default function SpotifyAuthToggle(props: SpotifyAuthToggleProps) {
  const [timeoutHandle, setTimeoutHandle] = useState<number>();

  const schedulePoll = () => {
    if (props.deviceCode.value) {
      setTimeoutHandle(setTimeout(poll, props.deviceCode.value.user_code ? 3000 : 100));
    } else {
      clearTimeout(timeoutHandle);
    }
  };
  const toggle = () => {
    props.deviceCode.value = props.deviceCode.value ? null : {};
    schedulePoll();
  };
  const poll = async () => {
    const res = await fetch("/led/spv2");
    const { auth, tokens } = parseData(await res.text());
    props.deviceCode.value = auth?.deviceCode ?? null;
    props.tokens.value = tokens ?? [];
    schedulePoll();
  };
  useEffect(schedulePoll, []);

  return (
    <div class="flex gap-4 items-center">
      <img className="w-6 h-6" src={SPOTIFY_ICON_SRC} />
      <div className="bg-gray-200 flex-1 h-0.5" />
      {props.deviceCode.value?.user_code
        ? ((code: string) => [
          <a href={`https://spotify.com/pair?code=${code}`}>{code}</a>,
          <div className="bg-gray-200 flex-1 h-0.5" />,
        ])(props.deviceCode.value?.user_code)
        : null}
      <form class="flex justify-center" method="POST" action={"/led/spv2?auth"} onSubmit={toggle}>
        <button type="submit">
          {props.deviceCode.value
            ? <img className="w-6 h-6" src={SPINNER_SRC} />
            : <UserPlus className="w-6 h-6" />}
        </button>
      </form>
    </div>
  );
}
