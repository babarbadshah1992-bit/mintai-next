"use client"

import { useState, useRef } from 'react'
import Webcam from 'react-webcam'

export default function CameraMic({ onCapture }: { onCapture: (image: string) => void }) {
  const [showCamera, setShowCamera] = useState(false)
  const webcamRef = useRef<Webcam>(null)

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      onCapture(imageSrc)
      setShowCamera(false)
    }
  }

  const startMic = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      alert("🎤 Mic started – voice input coming soon")
    } catch (err) {
      alert("Microphone access denied")
    }
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={() => setShowCamera(!showCamera)} className="icon-btn">📷</button>
      <button onClick={startMic} className="icon-btn">🎤</button>
      {showCamera && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'white', padding: '20px', borderRadius: '20px', zIndex: 1000, boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)' }}>
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width={300} />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={capture}>Capture</button>
            <button onClick={() => setShowCamera(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}