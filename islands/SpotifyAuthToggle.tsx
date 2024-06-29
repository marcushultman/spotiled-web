import type { Signal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";

interface SpotifyAuthToggleProps {
  isAuthenticating: Signal<boolean>;
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
    const res = await fetch("spotify/auth");
    props.isAuthenticating.value = (res.ok ? await res.json() : {}).isAuthenticating ?? false;
    schedulePoll();
  };
  useEffect(schedulePoll, []);

  return (
    <form
      class="flex items-center justify-center gap-2"
      method="POST"
      action={"/spotify/auth"}
      onSubmit={toggle}
    >
      <img
        className="w-8 h-8"
        src={props.isAuthenticating.value
          ? "https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif"
          : "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"}
      />
      <input
        class="px-4 py-2 bg-white text-green-600"
        type="submit"
        value={props.isAuthenticating.value ? "Cancel" : "Login"}
      />
    </form>
  );
}
