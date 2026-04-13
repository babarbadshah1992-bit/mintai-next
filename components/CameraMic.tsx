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
      alert("Mic error: " + event.error + ". Please check microphone permissions.")
    }
    recognition.start()
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={startScan} className="icon-btn" title="Scan Barcode">📷</button>
      <button onClick={startMic} className="icon-btn" title="Voice Input">🎤</button>
      {showCamera && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'white', padding: '20px', borderRadius: '20px', zIndex: 1000, boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)' }}>
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "environment" }} width={320} height={240} style={{ borderRadius: '12px' }} />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
            <button onClick={stopScan}>Cancel</button>
          </div>
          <p style={{ fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>🔍 Align barcode in frame</p>
        </div>
      )}
    </div>
  )
}