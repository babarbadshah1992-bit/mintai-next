"use client"

import { useState, useRef } from 'react'
import Webcam from 'react-webcam'
import { BrowserMultiFormatReader } from '@zxing/library'

export default function CameraMic({ onScan, onMicResult }) {
  const [showCamera, setShowCamera] = useState(false)
  const webcamRef = useRef(null)
  const readerRef = useRef(null)

  const startScan = () => {
    setShowCamera(true)
    const reader = new BrowserMultiFormatReader()
    readerRef.current = reader
    reader.decodeFromVideoDevice(null, webcamRef.current?.video, (result, err) => {
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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return alert("Voice not supported")
    const recognition = new SpeechRecognition()
    recognition.lang = 'hi-IN'
    recognition.onresult = (e) => onMicResult(e.results[0][0].transcript)
    recognition.onerror = () => alert("Mic error. Allow permission.")
    recognition.start()
  }

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <button onClick={startScan} className="icon-btn">📷</button>
      <button onClick={startMic} className="icon-btn">🎤</button>
      {showCamera && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'white', padding: 20, borderRadius: 28, zIndex: 1000, boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)', width: '90%', maxWidth: 360 }}>
          <Webcam ref={webcamRef} videoConstraints={{ facingMode: "environment" }} width="100%" style={{ borderRadius: 16 }} />
          <button onClick={stopScan} style={{ marginTop: 12, padding: '8px 24px', background: '#2e9e4f', color: 'white', border: 'none', borderRadius: 40 }}>Cancel</button>
        </div>
      )}
    </div>
  )
}