import { Upload, FileText, X } from "lucide-react";
import { useState, useRef } from "react";

export default function TranslateDocument() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0 animate-fade-in-up">
      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-1">
          Document Translation
        </h2>
        <p className="text-sm text-gray-500">
          Upload a document to translate. Supported formats: PDF, DOCX, TXT
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-4
          p-12 rounded-2xl border-2 border-dashed cursor-pointer
          transition-all duration-300 ease-out
          ${
            dragActive
              ? "border-indigo-500/60 bg-indigo-500/[0.06] scale-[1.01]"
              : file
                ? "border-green-500/30 bg-green-500/[0.03]"
                : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt,.doc"
          onChange={handleChange}
          className="hidden"
          id="doc-upload-input"
        />

        {file ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-200">{file.name}</p>
              <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div
              className={`
                w-16 h-16 rounded-2xl flex items-center justify-center
                bg-gradient-to-br from-indigo-600/10 to-purple-600/10
                border border-white/[0.06]
                transition-transform duration-300
                ${dragActive ? "scale-110" : ""}
              `}
            >
              <Upload
                className={`w-7 h-7 text-indigo-400 transition-transform duration-300 ${dragActive ? "animate-float" : ""}`}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-300 mb-1">
                Drag & drop your document here
              </p>
              <p className="text-xs text-gray-500">
                or{" "}
                <span className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  browse files
                </span>
              </p>
            </div>
          </>
        )}
      </div>

      {/* Translate button */}
      {file && (
        <button
          id="translate-doc-btn"
          className="
            w-full py-3.5 rounded-xl font-medium text-sm cursor-pointer
            bg-gradient-to-r from-indigo-600 to-purple-600 text-white
            shadow-lg shadow-indigo-500/25
            hover:shadow-indigo-500/40 hover:scale-[1.01]
            active:scale-[0.99]
            transition-all duration-300 ease-out
          "
        >
          Translate Document
        </button>
      )}
    </div>
  );
}
