import BrightnessSlider from "../islands/BrightnessSlider.tsx";

export default function Home() {
  return (
    <div class="p-4 mx-auto">
      <div class="flex(& col) gap-4 items-center">
        <h1 class="text-lg font-bold">SpotiLED</h1>
        <div class="self-stretch flex(& col) gap-4 px-2 py-4 border-1 rounded-lg">
          <BrightnessSlider />
        </div>

        <form
          class="self-stretch flex justify-center p-2"
          method="GET"
          action={"/mode"}
        >
          <input
            class="px-4 py-2 rounded-full"
            type="submit"
            value="Toggle mode"
          />
        </form>

        <form
          class="self-stretch flex gap-2"
          method="post"
          action={"/text"}
        >
          <input class="flex-1 border-1" name="text" placeholder="" />
          <input class="px-4 py-2 rounded-full" type="submit" value="Send" />
        </form>
      </div>
    </div>
  );
}
