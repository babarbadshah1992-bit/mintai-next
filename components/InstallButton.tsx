"use client";

import { useEffect, useState } from "react";

export default function InstallPopup() {
  const [promptEvent, setPromptEvent] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setPromptEvent(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () =>
      window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!promptEvent) return;
    promptEvent.prompt();
    await promptEvent.userChoice;
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position:"fixed",
      inset:0,
      background:"rgba(0,0,0,.45)",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      zIndex:9999
    }}>
      <div style={{
        background:"#fff",
        padding:"20px",
        borderRadius:"20px",
        maxWidth:"320px",
        textAlign:"center"
      }}>
        <h3>📲 Install MintAI</h3>
        <p>Install MintAI for faster access and a better experience.</p>

        <button
          onClick={install}
          style={{
            background:"#16a34a",
            color:"#fff",
            border:"none",
            padding:"10px 20px",
            borderRadius:"10px",
            marginTop:"10px"
          }}
        >
          Install Now
        </button>
      </div>
    </div>
  );
}