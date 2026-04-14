"use client"

import { useState, useRef } from 'react'
import Webcam from 'react-webcam'
import { BrowserMultiFormatReader } from '@zxing/library'

export default function CameraMic({ onScan, onMicResult }: { onScan: (result: string) => void; onMicResult: (text: string) => void }) {
  const [showCamera, setShowCamera] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null)

  const startScan = () => {
    setShowCamera(true)
    const codeReader = new BrowserMultiFormatReader()
    codeReaderRef.current = codeReader
    codeReader.decodeFromVideoDevice(null, webcamRef.current?.video as HTMLVideoElement, (result, err) => {
      if (result) {
        codeReader.reset()
        setShowCamera(false)
        onScan(result.getText())
      }
    })
  }

  const stopScan = () => {
    if (codeReaderRef.current) codeReaderRef.current.reset()
    setShowCamera(false)
  }

  const startMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Browser does not support voice input.")
      return
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'hi-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      onMicResult(text)
    }
    recognition.onerror = (event: any) => {
      console.error("Mic error", event.error)
      alert("Mic error: " + event.error + ". Please allow microphone access.")
    }
    recognition.start()
  }

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <button onClick={startScan} className="icon-btn" title="Scan product barcode">📷</button>
      <button onClick={startMic} className="icon-btn" title="Voice input (Hindi/English)">🎤</button>
      {showCamera && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'white', padding: '20px', borderRadius: '24px', zIndex: 1000, boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)', width: '90%', maxWidth: '360px' }}>
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "environment" }} width="100%" height="auto" style={{ borderRadius: '16px' }} />
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'center' }}>
            <button onClick={stopScan} style={{ padding: '8px 24px', background: '#2e9e4f', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer' }}>Cancel</button>
          </div>
          <p style={{ fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>🔍 Align barcode in the center</p>
        </div>
      )}
    </div>
  )
}