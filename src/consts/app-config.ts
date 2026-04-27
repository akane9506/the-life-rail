const SUPPORTED_LANGUAGES = ["en", "zh", "ja"] as const;
type Language = (typeof SUPPORTED_LANGUAGES)[number];
const LANGUAGE_LIST = [
  { label: "English", value: "en" },
  { label: "中文", value: "zh" },
  { label: "日本語", value: "ja" },
];

export { SUPPORTED_LANGUAGES, LANGUAGE_LIST };
export type { Language };
