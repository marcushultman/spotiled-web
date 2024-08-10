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
