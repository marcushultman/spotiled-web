import { type Signal, useComputed } from "@preact/signals";
import { Token } from "../src/spv2.ts";

interface BottomMenuProps {
  tokens: Signal<Token[]>;
  token: Signal<Token | undefined>;
}

export default function BottomMenu({ tokens, token }: BottomMenuProps) {
  const index = tokens.value.findIndex(({ access_token }) =>
    access_token === token.value?.access_token
  );
  const item = useComputed(() => {
    return {
      show: !!token.value,
      label: `Logout`,
      onClick: () => {
        token.value = undefined;
        tokens.value = tokens.value.filter((_, i) => i !== index);
        fetch(`/led/spv2?logout=${index}`, { method: "post" });
      },
    };
  });

  return (
    <div
      className={`bg-gray-400 w-full absolute bottom-0 rounded-t-xl transition-[max-height] duration-500 ${
        item.value.show ? "max-h-full" : "max-h-0"
      }`}
    >
      <div class="p-4 text-center text-white">
        <p class="text-xl" onClick={item.value.onClick}>{item.value.label}</p>
      </div>
    </div>
  );
}
