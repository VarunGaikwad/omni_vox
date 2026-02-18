import { ArrowLeftRight, Loader2, Copy, Check, Volume2, X } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  LANGUAGES,
  DEFAULT_SOURCE_LANG,
  DEFAULT_TARGET_LANG,
  DEBOUNCE_DELAY,
} from "../constants";
import { client } from "../api";

export default function TranslateText() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [sourceText, setSourceText] = useState(searchParams.get("text") || "");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState(
    searchParams.get("sl") || DEFAULT_SOURCE_LANG,
  );
  const [targetLang, setTargetLang] = useState(
    searchParams.get("tl") || DEFAULT_TARGET_LANG,
  );

  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const MAX_CHARS = 5000;

  // 🔥 Sync URL immediately (no debounce needed)
  useEffect(() => {
    setSearchParams(
      { sl: sourceLang, tl: targetLang, text: sourceText },
      { replace: true },
    );
  }, [sourceText, sourceLang, targetLang, setSearchParams]);

  const translateDocument = useCallback(async (text: string, to: string) => {
    if (!text.trim()) {
      setTranslatedText("");
      return;
    }

    if (text.length > MAX_CHARS) {
      setTranslatedText("Text exceeds maximum allowed length.");
      return;
    }

    // Cancel previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setIsTranslating(true);

    try {
      const response = await client.get("/unauth/translation", {
        params: { tl: to, text },
        signal: controller.signal,
      });

      setTranslatedText(response.data.translation);
    } catch (error: any) {
      if (error.name === "CanceledError") return;

      if (error.response?.status === 429) {
        setTranslatedText("Rate limit exceeded. Wait 30s.");
      } else {
        setTranslatedText("Translation failed.");
      }
    } finally {
      setIsTranslating(false);
    }
  }, []);

  // 🔥 Single debounce for translation only
  useEffect(() => {
    const timer = setTimeout(() => {
      translateDocument(sourceText, targetLang);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [sourceText, targetLang, translateDocument]);

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText("");
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    await navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setSourceText("");
    setTranslatedText("");
  };

  const getLangDisplay = (code: string) => {
    const lang = LANGUAGES.find((l) => l.code === code);
    return lang ? lang.name : code;
  };
  const charCount = sourceText.length;
  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0">
      {/* ── Language selector bar ───────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Source language */}
        <div className="flex-1 relative">
          <label className="block text-[11px] uppercase tracking-widest text-gray-500 mb-1 ml-1 font-medium">
            From
          </label>
          <select
            id="source-lang-select"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="
              w-full px-4 py-2.5 rounded-xl appearance-none cursor-pointer
              bg-white/4 border border-white/8
              text-gray-200 text-sm font-medium
              focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40
              hover:bg-white/6 hover:border-white/12
              transition-all duration-200 ease-out
            "
          >
            {LANGUAGES.map((lang) => (
              <option
                key={lang.code}
                value={lang.code}
                className="bg-[#1a1a2e] text-gray-200"
              >
                {lang.name} {lang.nativeName ? `(${lang.nativeName})` : ""}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 bottom-3 w-4 h-4 text-gray-500 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Swap button */}
        <div className="pt-4">
          <button
            id="swap-lang-btn"
            onClick={handleSwapLanguages}
            className="
              group/swap p-2.5 rounded-xl cursor-pointer
              bg-linear-to-br from-indigo-600/20 to-purple-600/20
              border border-indigo-500/20
              hover:from-indigo-600/30 hover:to-purple-600/30
              hover:border-indigo-500/40 hover:scale-110
              active:scale-95
              transition-all duration-300 ease-out
              shadow-lg shadow-indigo-500/5
            "
            title="Swap languages"
          >
            <ArrowLeftRight className="w-4 h-4 text-indigo-400 group-hover/swap:text-indigo-300 transition-colors" />
          </button>
        </div>

        {/* Target language */}
        <div className="flex-1 relative">
          <label className="block text-[11px] uppercase tracking-widest text-gray-500 mb-1 ml-1 font-medium">
            To
          </label>
          <select
            id="target-lang-select"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="
              w-full px-4 py-2.5 rounded-xl appearance-none cursor-pointer
              bg-white/4 border border-white/8
              text-gray-200 text-sm font-medium
              focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40
              hover:bg-white/6 hover:border-white/12
              transition-all duration-200 ease-out
            "
          >
            {LANGUAGES.map((lang) => (
              <option
                key={lang.code}
                value={lang.code}
                className="bg-[#1a1a2e] text-gray-200"
              >
                {lang.name} {lang.nativeName ? `(${lang.nativeName})` : ""}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 bottom-3 w-4 h-4 text-gray-500 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* ── Text areas — flex to fill remaining height ── */}
      <div className="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Source text panel */}
        <div className="relative group/source flex flex-col min-h-0">
          <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-indigo-500/20 via-transparent to-transparent opacity-0 group-hover/source:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="relative bg-white/3 border border-white/6 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10 flex flex-col flex-1 min-h-0">
            {/* Source header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/4 shrink-0">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full bg-indigo-500/60"
                  aria-hidden
                />
                {getLangDisplay(sourceLang)}
              </span>
              <div className="flex items-center gap-1">
                {sourceText && (
                  <button
                    id="clear-source-btn"
                    onClick={handleClear}
                    className="p-1 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all cursor-pointer"
                    title="Clear"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  id="tts-source-btn"
                  className="p-1 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all cursor-pointer"
                  title="Listen"
                  onClick={() => {
                    if (sourceText && window.speechSynthesis) {
                      const utter = new SpeechSynthesisUtterance(sourceText);
                      utter.lang = getSpeechLang(sourceLang);
                      window.speechSynthesis.speak(utter);
                    }
                  }}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <textarea
              id="source-textarea"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              maxLength={MAX_CHARS}
              className="
                w-full flex-1 min-h-0 p-4 bg-transparent resize-none
                text-gray-200 text-[15px] leading-relaxed
                placeholder:text-gray-600
                focus:outline-none
              "
              placeholder="Type or paste text to translate..."
            />

            {/* Character count */}
            <div className="flex items-center justify-end px-4 py-1.5 border-t border-white/4 shrink-0">
              <span
                className={`text-[10px] font-mono tracking-wide ${
                  charCount > MAX_CHARS * 0.9
                    ? "text-amber-400"
                    : "text-gray-600"
                }`}
              >
                {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Translation output panel */}
        <div className="relative group/target flex flex-col min-h-0">
          <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-purple-500/20 via-transparent to-transparent opacity-0 group-hover/target:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="relative bg-white/3 border border-white/6 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10 flex flex-col flex-1 min-h-0">
            {/* Target header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/4 shrink-0">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full bg-purple-500/60"
                  aria-hidden
                />
                {getLangDisplay(targetLang)}
                {isTranslating && (
                  <Loader2 className="w-3 h-3 text-indigo-400 animate-spin ml-1" />
                )}
              </span>
              <div className="flex items-center gap-1">
                <button
                  id="copy-translation-btn"
                  onClick={handleCopy}
                  disabled={!translatedText}
                  className={`
                    p-1 rounded-lg transition-all cursor-pointer
                    ${
                      translatedText
                        ? "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                        : "text-gray-700 cursor-not-allowed"
                    }
                  `}
                  title={copied ? "Copied!" : "Copy translation"}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  id="tts-target-btn"
                  className="p-1 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all cursor-pointer"
                  title="Listen"
                  onClick={() => {
                    if (translatedText && window.speechSynthesis) {
                      const utter = new SpeechSynthesisUtterance(
                        translatedText,
                      );
                      utter.lang = getSpeechLang(targetLang);
                      window.speechSynthesis.speak(utter);
                    }
                  }}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 min-h-0 flex flex-col">
              <textarea
                id="target-textarea"
                value={translatedText}
                readOnly
                className="
                  w-full flex-1 min-h-0 p-4 bg-transparent resize-none
                  text-gray-200 text-[15px] leading-relaxed
                  placeholder:text-gray-600
                  focus:outline-none
                "
                placeholder="Translation will appear here..."
              />

              {/* Shimmer loading overlay */}
              {isTranslating && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-indigo-500/50 to-transparent animate-shimmer" />
                </div>
              )}
            </div>

            {/* Translated char count */}
            <div className="flex items-center justify-end px-4 py-1.5 border-t border-white/4 shrink-0">
              <span className="text-[10px] font-mono tracking-wide text-gray-600">
                {translatedText.length.toLocaleString()} chars
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const getSpeechLang = (code: string) => {
  if (code === "hinglish") return "hi-IN";
  return code;
};
