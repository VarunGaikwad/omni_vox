import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import { Tabs } from "./components";
import { TranslateText, TranslateDocument } from "./pages";

function Root() {
  const [searchParams] = useSearchParams();
  const op = searchParams.get("op") || "translate";

  if (op === "docs") return <TranslateDocument />;
  return <TranslateText />;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Background orbs for ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
            animation: "orb-float-1 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            animation: "orb-float-2 25s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full opacity-10 blur-[80px]"
          style={{
            background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
            animation: "orb-float-1 15s ease-in-out infinite reverse",
          }}
        />
      </div>

      <main className="h-screen w-screen flex flex-col items-center px-4 py-4 overflow-hidden">
        <div className="w-full max-w-5xl flex flex-col min-h-0 flex-1 animate-fade-in-up">
          {/* Header / Branding */}
          <header className="text-center mb-3 shrink-0">
            <div className="inline-flex items-center gap-2.5 mb-1">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 8 6 6" />
                    <path d="m4 14 6-6 2-3" />
                    <path d="M2 5h12" />
                    <path d="M7 2h1" />
                    <path d="m22 22-5-10-5 10" />
                    <path d="M14 18h6" />
                  </svg>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0a0a0f]" />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                  OMNI VOX
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-gray-500 tracking-wide">
              Real-time AI-powered translation
            </p>
          </header>

          {/* Main card — flex-1 so it fills remaining space */}
          <div className="glass rounded-3xl p-1 flex-1 min-h-0 flex flex-col">
            <div className="glass-strong rounded-[22px] p-5 flex-1 min-h-0 flex flex-col">
              <Tabs />
              <section className="flex-1 min-h-0 flex flex-col">
                <Routes>
                  <Route path="/" element={<Root />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </section>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center mt-2 py-1 text-[10px] text-gray-600 shrink-0">
            Powered by AI · Built with ❤️
          </footer>
        </div>
      </main>
    </BrowserRouter>
  );
}
