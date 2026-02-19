export interface Language {
  code: string;
  name: string;
  nativeName?: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "hinglish", name: "Hinglish", nativeName: "Hinglish" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
];

export const DEFAULT_SOURCE_LANG = "en";
export const DEFAULT_TARGET_LANG = "ja";
export const DEBOUNCE_DELAY = 1500;
