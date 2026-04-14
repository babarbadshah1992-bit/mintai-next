"use client"

import { useState, useRef } from 'react'
import Webcam from 'react-webcam'
import { BrowserMultiFormatReader } from '@zxing/library'

export default function CameraMic({ onScan, onMicResult }: { onScan: (barcode: string) => void; onMicResult: (text: string) => void }) {
  const [showCamera, setShowCamera] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const readerRef = useRef<BrowserMultiFormatReader | null>(null)

  const startScan = () => {
    setShowCamera(true)
    const reader = new BrowserMultiFormatReader()
    readerRef.current = reader
    reader.decodeFromVideoDevice(null, webcamRef.current?.video as HTMLVideoElement, (result, err) => {
      if (result) {
        reader.reset()
        setShowCamera(false)
        onScan(result.getText())
      }
    })
  }

  const stopScan = () => {
    if (readerRef.current) readerRef.current.reset()
    setShowCamera(false)
  }

  const startMic = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Browser does not support voice input.")
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'hi-IN'
    recognition.interimResults = false
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      onMicResult(text)
    }
    recognition.onerror = (event: any) => {
      alert("Mic error: " + event.error + ". Please allow microphone access.")
    }
    recognition.start()
  }

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <button onClick={startScan} className="icon-btn" title="Scan barcode">📷</button>
      <button onClick={startMic} className="icon-btn" title="Voice input">🎤</button>
      {showCamera && (
        <div className="camera-modal">
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "environment" }} width="100%" style={{ borderRadius: '20px' }} />
          <button onClick={stopScan} style={{ marginTop: '12px', padding: '8px 24px', background: '#2e9e4f', color: 'white', border: 'none', borderRadius: '40px' }}>Cancel</button>
        </div>
      )}
      <style jsx>{`
        .camera-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 28px;
          z-index: 1000;
          box-shadow: 0 0 0 1000px rgba(0,0,0,0.5);
          width: 90%;
          max-width: 360px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}