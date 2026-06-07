"use client";

import { useEffect, useState } from "react";

export default function InstallPopup() {
  const [promptEvent, setPromptEvent] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setPromptEvent(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const install = async () => {
    if (!promptEvent) return;

    promptEvent.prompt();

    const result = await promptEvent.userChoice;

    if (result.outcome === "accepted") {
      setPromptEvent(null);
    }
  };

  if (!promptEvent) return null;

  return (
    <button
      onClick={install}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#16a34a",
        color: "#fff",
        border: "none",
        borderRadius: "50px",
        padding: "12px 18px",
        fontWeight: "bold",
        zIndex: 9999,
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      📲 Install App
    </button>
  );
}