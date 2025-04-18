import { useState, type FC } from "react";
import { Keyboard, X } from "lucide-react";
import { useFocusTrap } from "./useFocusTrap";

interface ShortcutSection {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

const SHORTCUT_SECTIONS: ShortcutSection[] = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["←"], description: "Move reservation one day left" },
      { keys: ["→"], description: "Move reservation one day right" },
      { keys: ["↑"], description: "Move reservation to room above" },
      { keys: ["↓"], description: "Move reservation to room below" },
    ],
  },
  {
    title: "Actions",
    shortcuts: [
      { keys: ["Delete"], description: "Delete selected reservation" },
      { keys: ["Escape"], description: "Deselect reservation" },
      { keys: ["Enter"], description: "Open reservation details" },
      { keys: ["Shift", "Drag"], description: "Copy reservation" },
    ],
  },
  {
    title: "View Controls",
    shortcuts: [
      { keys: ["+"], description: "Zoom in timeline" },
      { keys: ["-"], description: "Zoom out timeline" },
      { keys: ["Space", "Drag"], description: "Pan timeline" },
      { keys: ["?"], description: "Show/hide this guide" },
    ],
  },
];

interface KeyboardShortcutsGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsGuide: FC<KeyboardShortcutsGuideProps> = ({
  isOpen,
  onClose,
}) => {
  const modalRef = useFocusTrap(isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard Shortcuts Guide"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl outline-none"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close keyboard shortcuts guide"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-8">
          {SHORTCUT_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-medium text-gray-900">{section.title}</h3>
              <div className="space-y-2">
                {section.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="text-gray-600">{shortcut.description}</div>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <kbd
                          key={keyIndex}
                          className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 
                                   border border-gray-200 rounded-md shadow-sm"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <p className="text-sm text-gray-500">
            Press{" "}
            <kbd
              className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 
                                border border-gray-200 rounded-md shadow-sm"
            >
              ?
            </kbd>{" "}
            at any time to show this guide
          </p>
        </div>
      </div>
    </div>
  );
};
