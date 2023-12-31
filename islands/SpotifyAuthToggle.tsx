import type { Signal } from "@preact/signals";
import { Button } from "../components/Button.tsx";

interface SpotifyAuthToggleProps {
  isAuthenticating: Signal<boolean>;
}

export default function SpotifyAuthToggle(props: SpotifyAuthToggleProps) {
  const toggle = () => props.isAuthenticating.value = !props.isAuthenticating.value;
  return (
    <form
      class="self-stretch flex items-center justify-center p-2 gap-2"
      method="POST"
      action={"/spotify/auth"}
      onSubmit={toggle}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
        class="w-8 h-8"
      >
      </img>
      {JSON.stringify({ isAuthenticating: props.isAuthenticating.value })}
      <input
        class="px-4 py-2 rounded-full"
        type="submit"
        value="Login"
      />
    </form>
  );
}
