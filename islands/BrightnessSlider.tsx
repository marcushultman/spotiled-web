import { createRef, JSX } from "preact";
import { useEffect } from "preact/hooks";

interface Props {
  brightness: string;
  hue: string;
}

function debounceValue(f: (value: string) => void, timeout: number) {
  let value = "";
  let timer: number | null = null;
  return (e: JSX.TargetedEvent<HTMLInputElement>) => {
    value = e.currentTarget.value;
    if (timer === null) {
      const lastValue = value;
      f(value);
      timer = setTimeout(() => {
        if (value !== lastValue) f(value);
        timer = null;
      }, timeout);
    }
  };
}

export default function BrightnessSlider({ brightness, hue }: Props) {
  return (
    <div
      class="flex(& col) bg-warmGray-300 rounded-lg p-2 gap-6"
      onTouchStart={() => false}
    >
      {/* BRIGHTNESS */}
      <div class="flex gap-2 items-center">
        <span>☀️</span>
        <input
          type="range"
          value={brightness}
          min="1"
          max="63"
          class="w-full h-4 rounded-lg appearance-none bg-gradient-to-r from-warmGray-200 to-white"
          onInput={debounceValue(
            (value) => fetch("/settings/brightness", { method: "POST", body: value }),
            200,
          )}
        />
      </div>
      {/* HUE */}
      <div class="flex gap-2 items-center">
        <span>🔥</span>
        <input
          type="range"
          value={hue}
          min="0"
          max="255"
          class="w-full h-4 rounded-lg appearance-none bg-gradient-to-r from-orange-200 to-white"
          onInput={debounceValue(
            (value) => fetch("/settings/hue", { method: "POST", body: value }),
            200,
          )}
        />
      </div>
    </div>
  );
}
