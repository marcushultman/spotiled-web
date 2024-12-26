import { batch, type Signal, useComputed } from "@preact/signals";
import { parseData, Token } from "../src/spv2.ts";

interface BottomMenuProps {
  tokens: Signal<Token[]>;
  token: Signal<Token | undefined>;
}

export default function BottomMenu({ tokens, token }: BottomMenuProps) {
  const item = useComputed(() => {
    const index = tokens.value.findIndex((t) => t.access_token === token.value?.access_token);
    return {
      show: !!token.value,
      label: `Logout`,
      onClick: async () => {
        const res = await fetch(`/led/spv2?logout=${index}`, { method: "post" });
        const data = parseData(await res.text());
        batch(() => {
          token.value = undefined;
          tokens.value = data.tokens ?? [];
        });
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
