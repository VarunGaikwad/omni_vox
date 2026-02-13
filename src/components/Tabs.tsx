import { useSearchParams } from "react-router-dom";
import { FileText, Languages } from "lucide-react";

const tabs = [
  { name: "Text", op: "translate", icon: Languages },
  { name: "Document", op: "docs", icon: FileText },
];

export default function Tabs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentOp = searchParams.get("op") || "translate";

  const switchTab = (op: string) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      op,
    });
  };

  return (
    <nav className="mb-6">
      <div className="inline-flex items-center gap-1 rounded-2xl p-1 bg-white/[0.04] border border-white/[0.06]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentOp === tab.op;

          return (
            <button
              key={tab.op}
              id={`tab-${tab.op}`}
              onClick={() => switchTab(tab.op)}
              className={`
                relative flex items-center gap-2 py-2.5 px-5 rounded-xl
                text-sm font-medium tracking-wide
                transition-all duration-300 ease-out cursor-pointer
                ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.05]"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
              {isActive && (
                <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
