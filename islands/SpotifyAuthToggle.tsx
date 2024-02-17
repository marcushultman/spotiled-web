import type { Signal } from "@preact/signals";
import { Button } from "../components/Button.tsx";

interface SpotifyAuthToggleProps {
  isAuthenticating: Signal<boolean>;
}

export default function SpotifyAuthToggle(props: SpotifyAuthToggleProps) {
  const toggle = () => props.isAuthenticating.value = !props.isAuthenticating.value;
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
