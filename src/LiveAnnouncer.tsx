import { useState, useEffect, useCallback } from "react";

let announceMessage: (
  message: string,
  priority?: "polite" | "assertive"
) => void = () => {};

export function useLiveAnnouncer() {
  return useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      announceMessage(message, priority);
    },
    []
  );
}

export function LiveAnnouncer() {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");

  useEffect(() => {
    announceMessage = (
      message: string,
      priority: "polite" | "assertive" = "polite"
    ) => {
      if (priority === "assertive") {
        setAssertiveMessage(""); // Reset to trigger announcement
        setTimeout(() => setAssertiveMessage(message), 50);
      } else {
        setPoliteMessage(""); // Reset to trigger announcement
        setTimeout(() => setPoliteMessage(message), 50);
      }
    };
  }, []);

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </>
  );
}
