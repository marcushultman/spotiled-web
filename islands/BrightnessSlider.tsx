export interface BrightnessSliderProps {
  baseUrl: string;
}

export default function BrightnessSlider({ baseUrl }: BrightnessSliderProps) {
  return (
    <div class="flex(& col) py-6" onTouchStart={() => false}>
      <input
        type="range"
        value="128"
        min="0"
        max="255"
        class="w-full h-4 rounded-lg appearance-none bg-gradient-to-r from-red-500 to-blue-500"
        onInput={(e) => {
          fetch(`${baseUrl}/settings`, {
            method: "POST",
            headers: { setting: "brightness" },
            body: e.currentTarget.value,
          });
        }}
      />
    </div>
  );
}
