"use client";

import React, { useEffect, useState, useRef } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Typewriter state
  const fullText = "Install MintAI";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Install prompt listeners
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      // Installed ho gaya – typewriter effect ko immediately complete karein
      setDisplayText("✅ Installed");
      setIsTypingDone(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Typewriter effect (only runs once on mount and if not installed)
  useEffect(() => {
    if (isInstalled) return; // installed hai toh typing nahi karein

    if (index < fullText.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 80); // typing speed
    } else {
      setIsTypingDone(true);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, fullText, isInstalled]);

  // Reset typing when component mounts (if not installed)
  useEffect(() => {
    if (!isInstalled) {
      setDisplayText("");
      setIndex(0);
      setIsTypingDone(false);
    }
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (isInstalled) return; // already installed

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        if (result.outcome === "accepted") {
          setIsInstalled(true);
          setDisplayText("✅ Installed");
          setIsTypingDone(true);
          setDeferredPrompt(null);
        }
      } catch (error) {
        console.error("Install prompt error:", error);
      }
    } else {
      // No prompt available – just log
      console.log("Install prompt not available");
    }
  };

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
        gap: "12px",
        padding: "14px 24px",
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
      {/* Robot Icon with slight bounce animation */}
      <span
        style={{
          fontSize: "24px",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          animation: "bounce 2s infinite ease-in-out",
        }}
      >
        🤖
      </span>

      {/* Text container */}
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          lineHeight: 1.2,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {isInstalled ? (
            "✅ Installed"
          ) : (
            <>
              {displayText}
              {/* Blinking cursor – only when typing not done */}
              {!isTypingDone && (
                <span
                  style={{
                    display: "inline-block",
                    width: "2px",
                    height: "1em",
                    backgroundColor: "#ffffff",
                    animation: "blink 0.7s step-end infinite",
                    marginLeft: "2px",
                  }}
                />
              )}
            </>
          )}
        </span>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 500,
            opacity: 0.85,
            letterSpacing: "0.3px",
          }}
        >
          {isInstalled ? "Thank you! 🎉" : "Fast • Offline • Free"}
        </span>
      </span>

      {/* Keyframes for animations */}
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

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
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