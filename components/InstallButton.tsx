"use client";

import React, { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // 🔥 Development flag – production mein false kardein
  const isDevelopment = process.env.NODE_ENV === "development";

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Agar development mode hai toh installable true kar do (demo ke liye)
    if (isDevelopment) {
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isDevelopment]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Agar development mode mein prompt nahi hai toh alert dikhao
      if (isDevelopment) {
        alert("Development mode: Install prompt not available. Simulating install.");
        // Simulate install success
        setIsInstallable(false);
        setIsInstalled(true);
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;

      if (result.outcome === "accepted") {
        setIsInstallable(false);
        setIsInstalled(true);
        setDeferredPrompt(null);
      } else {
        console.log("User dismissed the install prompt");
      }
    } catch (error) {
      console.error("Error showing install prompt:", error);
    }
  };

  // Hide button if not installable and not development
  if (!isInstallable && !isDevelopment) return null;
  // Agar installed ho toh hatao
  if (isInstalled) return null;

  return (
    <button
      onClick={handleInstallClick}
      aria-label="Install MintAI application"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "14px 20px",
        background: "linear-gradient(135deg, #16a34a, #22c55e)",
        border: "none",
        borderRadius: "999px",
        color: "#ffffff",
        fontWeight: 700,
        fontSize: "16px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        cursor: "pointer",
        boxShadow:
          "0 8px 25px rgba(22, 163, 74, 0.35), 0 2px 8px rgba(0, 0, 0, 0.12)",
        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        animation: "fadeInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        transform: "scale(1)",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.06)";
        e.currentTarget.style.boxShadow =
          "0 12px 35px rgba(22, 163, 74, 0.45), 0 4px 12px rgba(0, 0, 0, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow =
          "0 8px 25px rgba(22, 163, 74, 0.35), 0 2px 8px rgba(0, 0, 0, 0.12)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.95)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1.06)";
      }}
    >
      <span
        style={{
          fontSize: "20px",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        📲
      </span>
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          lineHeight: 1.2,
        }}
      >
        <span>Install MintAI</span>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 500,
            opacity: 0.85,
            letterSpacing: "0.3px",
          }}
        >
          Fast • Offline • Free
        </span>
      </span>
      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.92);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (min-width: 768px) {
          button {
            bottom: 24px !important;
            right: 24px !important;
          }
        }
        @media (max-width: 480px) {
          button {
            padding: 12px 16px !important;
            font-size: 14px !important;
            gap: 8px !important;
          }
          button span span span {
            font-size: 10px !important;
          }
        }
      `}</style>
    </button>
  );
}