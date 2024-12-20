export type Color = [number, number, number];

const kWarm: Color[] = [
  [155, 41, 72],
  [255, 114, 81],
  [255, 202, 123],
  [255, 205, 116],
  [255, 237, 191],
  [255, 255, 255],
];

function hueFactor(zero_to_one: number): Color {
  const s = zero_to_one * (kWarm.length - 1);
  const i = Math.floor(s);
  return i == kWarm.length - 1
    ? kWarm[i]
    : kWarm[i].map((v, j) => v + (kWarm[i + 1][j] - kWarm[i][j]) * (s - i)) as Color;
}

function brightnessForTimeOfDay(hour: number): number {
  return Math.pow(Math.sin(Math.PI * hour / 24), 3);
}

function getHour(): number {
  return new Date().getHours();
}

function _timeOfDayBrightness(b: number, hour = getHour()): number {
  return b ? Math.min(b * brightnessForTimeOfDay(hour) + 1, b) : 0;
}

interface Settings {
  brightness: number;
  hue: number;
}

export function timeOfDayBrightness(bp: Settings, hour = getHour()): Color {
  const f = _timeOfDayBrightness(bp.brightness, hour);
  return hueFactor(bp.hue / 255.0).map((v) => Math.floor(v * f / 255)) as Color;
}

if (import.meta.main) {
  let s = "  H: ";
  for (let hour = 0; hour < 24; ++hour) {
    s += (hour + " ").slice(0, 2) + "  ";
  }
  console.log(s);
  for (let i = 0; i < 256; i += i < 16 ? 1 : 16) {
    let s = (i + "  ").slice(0, 3) + ": ";
    for (let hour = 0; hour < 24; ++hour) {
      s += (Math.floor(_timeOfDayBrightness(i, hour)) + "  ").slice(0, 3) + " ";
    }
    console.log(s);
  }
}

/*

int main(int argc, char *argv[]) {
  std::cout << "  H: ";
  for (auto hour = 0; hour < 24; ++hour) {
    auto s = std::to_string(hour);
    s.resize(2, ' ');
    std::cout << s << "  ";
  }
  std::cout << std::endl;
  for (auto i = 0; i < 256; i += (i < 16 ? 1 : 16)) {
    auto s = std::to_string(i);
    s.resize(3, ' ');
    std::cout << s << ": ";
    for (auto hour = 0; hour < 24; ++hour) {
      auto s = std::to_string(int(timeOfDayBrightness(i, hour)));
      s.resize(3, ' ');
      std::cout << s << " ";
    }
    std::cout << std::endl;
  }

  return 0;
}

  H: 0   1   2   3   4   5   6   7   8   9   10  11  12  13  14  15  16  17  18  19  20  21  22  23
0  : 0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0
1  : 1   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1
2  : 1   1   1   1   1   1   1   1   2   2   2   2   2   2   2   2   2   1   1   1   1   1   1   1
3  : 1   1   1   1   1   1   2   2   2   3   3   3   3   3   3   3   2   2   2   1   1   1   1   1
4  : 1   1   1   1   1   1   2   2   3   4   4   4   4   4   4   4   3   2   2   1   1   1   1   1
5  : 1   1   1   1   1   2   2   3   4   4   5   5   5   5   5   4   4   3   2   2   1   1   1   1
6  : 1   1   1   1   1   2   3   3   4   5   6   6   6   6   6   5   4   3   3   2   1   1   1   1
7  : 1   1   1   1   1   2   3   4   5   6   7   7   7   7   7   6   5   4   3   2   1   1   1   1
8  : 1   1   1   1   1   2   3   4   6   7   8   8   8   8   8   7   6   4   3   2   1   1   1   1
9  : 1   1   1   1   2   3   4   5   6   8   9   9   9   9   9   8   6   5   4   3   2   1   1   1
10 : 1   1   1   1   2   3   4   5   7   8   10  10  10  10  10  8   7   5   4   3   2   1   1   1
11 : 1   1   1   1   2   3   4   6   8   9   10  11  11  11  10  9   8   6   4   3   2   1   1   1
12 : 1   1   1   1   2   3   5   6   8   10  11  12  12  12  11  10  8   6   5   3   2   1   1   1
13 : 1   1   1   1   2   3   5   7   9   11  12  13  13  13  12  11  9   7   5   3   2   1   1   1
14 : 1   1   1   1   2   4   5   7   10  12  13  14  14  14  13  12  10  7   5   4   2   1   1   1
15 : 1   1   1   1   2   4   6   8   10  12  14  15  15  15  14  12  10  8   6   4   2   1   1   1
16 : 1   1   1   1   2   4   6   8   11  13  15  16  16  16  15  13  11  8   6   4   2   1   1   1
32 : 1   1   1   2   4   8   12  16  21  26  29  32  32  32  29  26  21  16  12  8   4   2   1   1
48 : 1   1   1   3   6   11  17  24  32  38  44  47  48  47  44  38  32  24  17  11  6   3   1   1
64 : 1   1   2   4   8   15  23  32  42  51  58  63  64  63  58  51  42  32  23  15  8   4   2   1
80 : 1   1   2   5   10  19  29  40  52  64  73  78  80  78  73  64  52  40  29  19  10  5   2   1
96 : 1   1   2   6   12  22  34  48  63  76  87  94  96  94  87  76  63  48  34  22  12  6   2   1
112: 1   1   2   7   14  26  40  56  73  89  101 110 112 110 101 89  73  56  40  26  14  7   2   1
128: 1   1   3   8   16  29  46  64  84  101 116 125 128 125 116 101 84  64  46  29  16  8   3   1
144: 1   1   3   9   18  33  51  72  94  114 130 141 144 141 130 114 94  72  51  33  18  9   3   1
160: 1   1   3   9   20  37  57  80  104 127 145 156 160 156 145 127 104 80  57  37  20  9   3   1
176: 1   1   4   10  22  40  63  88  115 139 159 172 176 172 159 139 115 88  63  40  22  10  4   1
192: 1   1   4   11  24  44  68  96  125 152 174 188 192 188 174 152 125 96  68  44  24  11  4   1
208: 1   1   4   12  26  47  74  104 136 165 188 203 208 203 188 165 136 104 74  47  26  12  4   1
224: 1   1   4   13  28  51  80  112 146 177 202 219 224 219 202 177 146 112 80  51  28  13  4   1
240: 1   1   5   14  30  55  85  120 156 190 217 234 240 234 217 190 156 120 85  55  30  14  5   1

*/
