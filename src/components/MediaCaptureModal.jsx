import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, Mic, X, Check, RefreshCw, Upload, Play, Square, Pause } from 'lucide-react';
import { saveMediaItem } from '../utils/mediaStore';

export default function MediaCaptureModal({ dateKey, onClose, onSaved }) {
  const [mode, setMode] = useState('photo'); // 'photo' | 'video' | 'audio'
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [capturedDataUrl, setCapturedDataUrl] = useState(null);
  const [mediaBlob, setMediaBlob] = useState(null);
  const [caption, setCaption] = useState('');
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Initialize camera / mic stream when mode changes
  useEffect(() => {
    stopStream();
    setCapturedDataUrl(null);
    setMediaBlob(null);
    setIsRecording(false);
    setRecordTime(0);
    setCameraError(null);

    async function initDevice() {
      try {
        let constraints = {};
        if (mode === 'photo') {
          constraints = { video: { width: 1280, height: 720 } };
        } else if (mode === 'video') {
          constraints = { video: { width: 1280, height: 720 }, audio: true };
        } else if (mode === 'audio') {
          constraints = { audio: true };
        }

        const devStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(devStream);
        if (videoRef.current && mode !== 'audio') {
          videoRef.current.srcObject = devStream;
        }
      } catch (err) {
        console.error('Camera/Mic permission error:', err);
        setCameraError('Camera/Microphone access not available or denied. You can still upload files directly below.');
      }
    }

    initDevice();

    return () => {
      stopStream();
    };
  }, [mode]);

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Photo Capture
  const handleTakeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedDataUrl(dataUrl);
  };

  // Video / Audio Recording
  const handleStartRecord = () => {
    if (!stream) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const mimeType = mode === 'video' ? 'video/webm' : 'audio/webm';
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setMediaBlob(blob);
      setCapturedDataUrl(url);
    };

    recorder.start();
    setIsRecording(true);
    setRecordTime(0);

    timerRef.current = setInterval(() => {
      setRecordTime(prev => prev + 1);
    }, 1000);
  };

  const handleStopRecord = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // File Upload fallback
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setCapturedDataUrl(evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Save Media to IndexedDB
  const handleSaveMedia = async () => {
    if (!capturedDataUrl) return;

    let finalDataUrl = capturedDataUrl;
    if (mediaBlob) {
      // convert blob to base64 for persistent IndexedDB storage
      finalDataUrl = await new Promise((resolve) => {
        const r = new FileReader();
        r.onloadend = () => resolve(r.result);
        r.readAsDataURL(mediaBlob);
      });
    }

    const item = {
      id: 'media_' + Date.now(),
      dateKey,
      type: mode,
      dataUrl: finalDataUrl,
      caption: caption.trim() || `${mode.toUpperCase()} check-in for ${dateKey}`,
      createdAt: new Date().toISOString()
    };

    await saveMediaItem(item);
    stopStream();
    onSaved(item);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
      <div className="card animate-fade-in" style={{ width: '560px', padding: '28px', maxWidth: '95vw' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Capture Everyday Media</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Log photos, video journals, or audio notes for {dateKey}</p>
          </div>
          <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => { stopStream(); onClose(); }}>
            <X size={20} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'var(--bg-app)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          <button
            type="button"
            className={mode === 'photo' ? 'btn btn-primary' : 'btn btn-ghost'}
            style={{ flex: 1, fontSize: '0.85rem', padding: '8px' }}
            onClick={() => setMode('photo')}
          >
            <Camera size={16} /> Photo
          </button>
          <button
            type="button"
            className={mode === 'video' ? 'btn btn-primary' : 'btn btn-ghost'}
            style={{ flex: 1, fontSize: '0.85rem', padding: '8px' }}
            onClick={() => setMode('video')}
          >
            <Video size={16} /> Video Log
          </button>
          <button
            type="button"
            className={mode === 'audio' ? 'btn btn-primary' : 'btn btn-ghost'}
            style={{ flex: 1, fontSize: '0.85rem', padding: '8px' }}
            onClick={() => setMode('audio')}
          >
            <Mic size={16} /> Audio Note
          </button>
        </div>

        {/* Device Viewport / Preview */}
        <div style={{ background: '#000000', borderRadius: 'var(--radius-md)', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', marginBottom: '20px' }}>
          
          {cameraError ? (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>
              <p style={{ fontSize: '0.85rem' }}>{cameraError}</p>
            </div>
          ) : capturedDataUrl ? (
            mode === 'photo' ? (
              <img src={capturedDataUrl} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : mode === 'video' ? (
              <video src={capturedDataUrl} controls style={{ width: '100%', height: '100%' }} />
            ) : (
              <div style={{ color: '#ffffff', textAlign: 'center' }}>
                <Mic size={48} style={{ color: 'var(--accent-ice)' }} />
                <div style={{ marginTop: '10px', fontSize: '0.9rem', fontWeight: 700 }}>Audio Note Recorded</div>
                <audio src={capturedDataUrl} controls style={{ marginTop: '12px' }} />
              </div>
            )
          ) : mode === 'audio' ? (
            <div style={{ color: '#ffffff', textAlign: 'center' }}>
              <Mic size={48} style={{ color: isRecording ? 'var(--accent-fire)' : 'var(--accent-ice)' }} />
              <div style={{ marginTop: '12px', fontSize: '1.1rem', fontWeight: 800 }}>
                {isRecording ? `Recording... ${recordTime}s` : 'Ready to record voice note'}
              </div>
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {isRecording && (
                <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(239, 68, 68, 0.9)', color: '#ffffff', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff' }} />
                  REC {recordTime}s
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
          {!capturedDataUrl ? (
            mode === 'photo' ? (
              <button className="btn btn-ice" style={{ padding: '12px 24px' }} onClick={handleTakeSnapshot} disabled={!!cameraError}>
                <Camera size={18} /> Take Photo Snapshot
              </button>
            ) : isRecording ? (
              <button className="btn btn-secondary" style={{ padding: '12px 24px', color: '#dc2626', borderColor: '#fca5a5' }} onClick={handleStopRecord}>
                <Square size={18} /> Stop Recording
              </button>
            ) : (
              <button className="btn btn-ice" style={{ padding: '12px 24px' }} onClick={handleStartRecord} disabled={!!cameraError}>
                <Play size={18} /> Start Recording
              </button>
            )
          ) : (
            <button className="btn btn-secondary" onClick={() => { setCapturedDataUrl(null); setMediaBlob(null); }}>
              <RefreshCw size={16} /> Retake / Clear
            </button>
          )}

          <label className="btn btn-secondary">
            <Upload size={16} /> Upload File
            <input type="file" accept={mode === 'photo' ? 'image/*' : mode === 'video' ? 'video/*' : 'audio/*'} onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Caption Input */}
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Add caption or note (e.g. Day 15 Morning Physique)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', outline: 'none' }}
          />
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => { stopStream(); onClose(); }}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSaveMedia} disabled={!capturedDataUrl}>
            <Check size={16} /> Save to {dateKey} Log
          </button>
        </div>

      </div>
    </div>
  );
}
