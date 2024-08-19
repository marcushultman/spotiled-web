import { JSX } from "preact";

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

/** WaveIndices

std::pair<int, int> waveIndices(double t, uint8_t percent, int x, int width, int top, int bottom) {
  auto x_percent = 100 * double(x) / 23;
  auto f = x_percent < percent ? (percent - x_percent) / double(percent) : 0;
  auto w = f * std::sin(2 * M_PI * (t + x) / width);
  auto y1 = 8 + top * w;
  auto y2 = 8 + bottom * w;
  return {std::min<int>(std::floor(y1), std::floor(y2)),
          std::max<int>(std::ceil(y1), std::ceil(y2))};
}

 */

export default function BrightnessSlider({ brightness, hue }: Props) {
  const el = (path: string, label: string, cls: string, value: string, range: [string, string]) => (
    <div class="flex gap-2 items-center">
      <span>{label}</span>
      <input
        type="range"
        value={value}
        min={range[0]}
        max={range[1]}
        class={`w-full h-4 rounded-lg appearance-none bg-gradient-to-r ${cls} to-white`}
        onInput={debounceValue((value) => fetch(path + value, { method: "POST" }), 200)}
      />
    </div>
  );
  return (
    <div class="flex(& col) bg-warmGray-300 rounded-lg p-2 gap-6" onTouchStart={() => false}>
      {el("/settings2?brightness=", "☀️", "from-warmGray-200", brightness, ["1", "63"])}
      {el("/settings2?hue=", "🔥", "from-orange-200", hue, ["0", "255"])}
    </div>
  );
}
