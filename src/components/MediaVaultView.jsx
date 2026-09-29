import React, { useState, useEffect } from 'react';
import { Camera, Video, Mic, Trash2, Plus, Calendar, Film, Image as ImageIcon, Volume2, X } from 'lucide-react';
import { getAllMedia, deleteMediaItem } from '../utils/mediaStore';
import MediaCaptureModal from './MediaCaptureModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { getTodayKey } from '../utils/storage';

export default function MediaVaultView() {
  const [mediaList, setMediaList] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'photo' | 'video' | 'audio'
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [activeMedia, setActiveMedia] = useState(null);
  const [mediaToDelete, setMediaToDelete] = useState(null);

  const fetchMedia = async () => {
    try {
      const items = await getAllMedia();
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMediaList(items);
    } catch (err) {
      console.error('Error fetching media:', err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleRequestDelete = (item, e) => {
    if (e) e.stopPropagation();
    setMediaToDelete(item);
  };

  const handleConfirmDelete = async () => {
    if (!mediaToDelete) return;
    await deleteMediaItem(mediaToDelete.id);
    fetchMedia();
    if (activeMedia?.id === mediaToDelete.id) setActiveMedia(null);
    setMediaToDelete(null);
  };

  const filteredItems = mediaList.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header & Capture Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Everyday Media Vault</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Your personal gallery of daily transformation photos, video journals, and voice logs.
          </p>
        </div>

        <button className="btn btn-ice" onClick={() => setShowCaptureModal(true)}>
          <Camera size={16} /> Capture Media Now
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { id: 'all', label: `All Clips (${mediaList.length})`, icon: Film },
          { id: 'photo', label: `Photos (${mediaList.filter(m => m.type === 'photo').length})`, icon: ImageIcon },
          { id: 'video', label: `Video Logs (${mediaList.filter(m => m.type === 'video').length})`, icon: Video },
          { id: 'audio', label: `Voice Notes (${mediaList.filter(m => m.type === 'audio').length})`, icon: Volume2 },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = filterType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={isActive ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Media Grid */}
      {filteredItems.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <Camera size={48} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>No media captured yet</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
            Click "Capture Media Now" to take your daily physique photo, record a video clip, or record a voice note!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="card"
              onClick={() => setActiveMedia(item)}
              style={{
                padding: '12px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                height: '260px'
              }}
            >
              {/* Media Preview Box */}
              <div style={{ background: '#000000', borderRadius: 'var(--radius-md)', height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                {item.type === 'photo' ? (
                  <img src={item.dataUrl} alt={item.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : item.type === 'video' ? (
                  <>
                    <video src={item.dataUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Video size={32} style={{ color: '#ffffff' }} />
                    </div>
                  </>
                ) : (
                  <div style={{ color: '#ffffff', textAlign: 'center' }}>
                    <Volume2 size={36} style={{ color: 'var(--accent-ice)' }} />
                    <div style={{ fontSize: '0.75rem', marginTop: '6px', color: '#94a3b8' }}>Voice Note</div>
                  </div>
                )}

                <span className="badge badge-purple" style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '0.65rem' }}>
                  {item.dateKey}
                </span>

                <button
                  className="btn btn-ghost"
                  style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px', background: 'rgba(0,0,0,0.5)', color: '#ffffff' }}
                  onClick={(e) => handleRequestDelete(item, e)}
                  title="Delete media clip"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Caption & Date info */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.caption}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Capture Modal */}
      {showCaptureModal && (
        <MediaCaptureModal
          dateKey={getTodayKey()}
          onClose={() => setShowCaptureModal(false)}
          onSaved={() => fetchMedia()}
        />
      )}

      {/* Lightbox Inspector Modal */}
      {activeMedia && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4000 }}>
          <div className="card animate-fade-in" style={{ width: '720px', padding: '28px', maxWidth: '95vw', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-ice">{activeMedia.dateKey}</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '4px' }}>{activeMedia.caption}</h3>
              </div>
              <button className="btn btn-ghost" onClick={() => setActiveMedia(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#000000', borderRadius: 'var(--radius-md)', minHeight: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '20px' }}>
              {activeMedia.type === 'photo' ? (
                <img src={activeMedia.dataUrl} alt={activeMedia.caption} style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }} />
              ) : activeMedia.type === 'video' ? (
                <video src={activeMedia.dataUrl} controls autoPlay style={{ width: '100%', maxHeight: '500px' }} />
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#ffffff' }}>
                  <Volume2 size={48} style={{ color: 'var(--accent-ice)', margin: '0 auto 16px auto' }} />
                  <audio src={activeMedia.dataUrl} controls autoPlay />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-secondary" style={{ color: '#ef4444', borderColor: '#7f1d1d' }} onClick={(e) => handleRequestDelete(activeMedia, e)}>
                <Trash2 size={16} /> Delete Media
              </button>
              <button className="btn btn-primary" onClick={() => setActiveMedia(null)}>
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {mediaToDelete && (
        <ConfirmDeleteModal
          mediaItem={mediaToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => setMediaToDelete(null)}
        />
      )}

    </div>
  );
}
