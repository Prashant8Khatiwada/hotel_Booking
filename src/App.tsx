import { useState, Suspense, useEffect } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { LoadingState } from "./LoadingState";
import RoomStatusBar from "./RoomStatusBar";
import { ListRoom } from "./ListRoom";
import { KeyboardShortcutsGuide } from "./KeyboardShortcutsGuide";

function App() {
  const [frameDate, setFrameDate] = useState<number>(21);
  const [isShortcutsGuideOpen, setIsShortcutsGuideOpen] = useState(false);

  // Add keyboard shortcut listener for the shortcuts guide
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" || (e.key === "/" && !e.isComposing)) {
        e.preventDefault();
        setIsShortcutsGuideOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingState
              size="large"
              message="Loading hotel reservation system..."
            />
          </div>
        }
      >
        <div className="min-h-screen bg-gray-50">
          <ErrorBoundary
            fallback={
              <div className="p-4">
                <div className="bg-red-50 p-4 rounded-md">
                  <p className="text-red-700">Failed to load room status bar</p>
                </div>
              </div>
            }
          >
            <div className="sticky top-0 z-50 bg-white border-b-[6px] border-[#D9D9D980]">
              <RoomStatusBar
                setFrameDate={setFrameDate}
                frameDate={frameDate}
                onToggleShortcutsGuide={() => setIsShortcutsGuideOpen(true)}
              />
            </div>
          </ErrorBoundary>

          <ErrorBoundary
            fallback={
              <div className="p-4">
                <div className="bg-red-50 p-4 rounded-md">
                  <p className="text-red-700">Failed to load room scheduler</p>
                </div>
              </div>
            }
          >
            <main>
              <ListRoom frameDate={frameDate} />
            </main>
          </ErrorBoundary>

          <KeyboardShortcutsGuide
            isOpen={isShortcutsGuideOpen}
            onClose={() => setIsShortcutsGuideOpen(false)}
          />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
