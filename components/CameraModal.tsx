"use client"

import { useState, useRef } from 'react'
import Webcam from 'react-webcam'
import { BrowserMultiFormatReader } from '@zxing/library'

export default function CameraModal({ onClose, onResult }: { onClose: () => void; onResult: (text: string) => void }) {
  const [analysisType, setAnalysisType] = useState<'skin' | 'food' | 'plant' | 'report'>('skin')
  const [scanning, setScanning] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const readerRef = useRef<BrowserMultiFormatReader | null>(null)

  const captureAndAnalyze = async () => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (!imageSrc) return

    setScanning(true)
    
    const res = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageSrc, type: analysisType })
    })
    const data = await res.json()
    onResult(data.analysis)
    onClose()
  }

  const startBarcodeScan = () => {
    const reader = new BrowserMultiFormatReader()
    readerRef.current = reader
    reader.decodeFromVideoDevice(null, webcamRef.current?.video as HTMLVideoElement, (result) => {
      if (result) {
        reader.reset()
        onResult(`Product barcode: ${result.getText()}`)
        onClose()
      }
    })
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '20px', width: '90%', maxWidth: '500px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => setAnalysisType('skin')} style={{ background: analysisType === 'skin' ? '#2e9e4f' : '#ddd', color: analysisType === 'skin' ? 'white' : 'black', padding: '8px 16px', borderRadius: '30px', border: 'none', cursor: 'pointer' }}>🧴 Skin</button>
          <button onClick={() => setAnalysisType('food')} style={{ background: analysisType === 'food' ? '#2e9e4f' : '#ddd', color: analysisType === 'food' ? 'white' : 'black', padding: '8px 16px', borderRadius: '30px', border: 'none', cursor: 'pointer' }}>🍎 Food</button>
          <button onClick={() => setAnalysisType('plant')} style={{ background: analysisType === 'plant' ? '#2e9e4f' : '#ddd', color: analysisType === 'plant' ? 'white' : 'black', padding: '8px 16px', borderRadius: '30px', border: 'none', cursor: 'pointer' }}>🌿 Plant</button>
          <button onClick={() => setAnalysisType('report')} style={{ background: analysisType === 'report' ? '#2e9e4f' : '#ddd', color: analysisType === 'report' ? 'white' : 'black', padding: '8px 16px', borderRadius: '30px', border: 'none', cursor: 'pointer' }}>📄 Report</button>
        </div>
        
        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "environment" }} width="100%" style={{ borderRadius: '16px' }} />
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'center' }}>
          <button onClick={captureAndAnalyze} style={{ background: '#2e9e4f', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>📸 Analyze</button>
          <button onClick={startBarcodeScan} style={{ background: '#ff69b4', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>📷 Scan Barcode</button>
          <button onClick={onClose} style={{ background: '#ccc', padding: '10px 20px', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  )
}