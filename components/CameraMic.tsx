"use client"

import { useState, useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import { BrowserMultiFormatReader } from '@zxing/library'

export default function CameraMic({ onScan, onMicResult }: { onScan: (result: string) => void; onMicResult?: (text: string) => void }) {
  const [showCamera, setShowCamera] = useState(false)
  const [scanning, setScanning] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null)

  // Rear camera ke liye constraints
  const videoConstraints = {
    facingMode: { exact: "environment" }, // rear camera
    width: { ideal: 1280 },
    height: { ideal: 720 }
  }

  const startScan = () => {
    setShowCamera(true)
    setScanning(true)
    const codeReader = new BrowserMultiFormatReader()
    codeReaderRef.current = codeReader
    codeReader.decodeFromVideoDevice(null, webcamRef.current?.video as HTMLVideoElement, (result, err) => {
      if (result) {
        codeReader.reset()
        setScanning(false)
        setShowCamera(false)
        onScan(result.getText())
      }
      if (err && !result) {
        console.error(err)
      }
    })
  }

  const stopScan = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset()
    }
    setScanning(false)
    setShowCamera(false)
  }

  // Voice input using Web Speech API
  const startMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Sorry, your browser does not support voice input.")
      return
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'hi-IN' // Hindi + English
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript
      if (onMicResult) onMicResult(speechText)
    }
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error)
      alert("Mic error: " + event.error)
    }
    recognition.start()
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={startScan} className="icon-btn" title="Scan Barcode">📷</button>
      <button onClick={startMic} className="icon-btn" title="Voice Input">🎤</button>
      {showCamera && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'white', padding: '20px', borderRadius: '20px', zIndex: 1000, boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)' }}>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            width={320}
            height={240}
            style={{ borderRadius: '12px' }}
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
            <button onClick={stopScan}>Cancel</button>
          </div>
          <p style={{ fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>🔍 Align barcode in frame</p>
        </div>
      )}
    </div>
  )
}