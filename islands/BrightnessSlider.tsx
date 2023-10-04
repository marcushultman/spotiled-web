import { createRef } from "preact";
import { useEffect } from "preact/hooks";

export interface BrightnessSliderProps {
  baseUrl: string;
}

export default function BrightnessSlider({ baseUrl }: BrightnessSliderProps) {
  const brightnessRef = createRef<HTMLInputElement>();
  const hueRef = createRef<HTMLInputElement>();

  useEffect(() => {
    Promise.all([
      fetch(`${baseUrl}/settings/brightness`),
      fetch(`${baseUrl}/settings/hue`),
    ])
      .then(([r1, r2]) =>
        r1.ok && r2.ok ? Promise.all([r1.text(), r2.text()]) : ["128", "128"]
      )
      .then(([brightness, hue]) => {
        if (brightnessRef.current && hueRef.current) {
          brightnessRef.current.value = brightness;
          hueRef.current.value = hue;
        }
      });
  }, []);

  return (
    <div
      class="flex(& col) bg-warmGray-300 rounded-lg p-2 gap-6"
      onTouchStart={() => false}
    >
      {/* BRIGHTNESS */}
      <div class="flex gap-2 items-center">
        <span>☀️</span>
        <input
          ref={brightnessRef}
          type="range"
          value="128"
          min="0"
          max="255"
          class="w-full h-4 rounded-lg appearance-none bg-gradient-to-r from-warmGray-200 to-white"
          onInput={(e) =>
            fetch(`${baseUrl}/settings/brightness`, {
              method: "POST",
              body: e.currentTarget.value,
            })}
        />
      </div>
      {/* HUE */}
      <div class="flex gap-2 items-center">
        <span>🔥</span>
        <input
          ref={hueRef}
          type="range"
          value="128"
          min="0"
          max="255"
          class="w-full h-4 rounded-lg appearance-none bg-gradient-to-r from-orange-200 to-white"
          onInput={(e) =>
            fetch(`${baseUrl}/settings/hue`, {
              method: "POST",
              body: e.currentTarget.value,
            })}
        />
      </div>
    </div>
  );
}
