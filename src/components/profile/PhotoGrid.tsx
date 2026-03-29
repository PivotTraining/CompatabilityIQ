'use client'

import { useCallback, useRef, useState } from 'react'

interface PhotoGridProps {
  photos: string[]
  onUpload: (file: File) => Promise<void>
  onDelete: (index: number) => Promise<void>
  onReorder?: (from: number, to: number) => void
}

const MAX_SLOTS = 6

export default function PhotoGrid({ photos, onUpload, onDelete, onReorder }: PhotoGridProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null)
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null)
  const [dragSourceSlot, setDragSourceSlot] = useState<number | null>(null)
  const [deletingSlot, setDeletingSlot] = useState<number | null>(null)

  const handleSlotClick = useCallback(
    (index: number) => {
      if (index >= photos.length && fileInputRef.current) {
        setUploadingSlot(index)
        fileInputRef.current.click()
      }
    },
    [photos.length]
  )

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) {
        setUploadingSlot(null)
        return
      }

      try {
        await onUpload(file)
      } catch (err) {
        console.error('Upload failed:', err)
      } finally {
        setUploadingSlot(null)
        // Reset file input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [onUpload]
  )

  const handleDelete = useCallback(
    async (e: React.MouseEvent, index: number) => {
      e.stopPropagation()
      setDeletingSlot(index)
      try {
        await onDelete(index)
      } catch (err) {
        console.error('Delete failed:', err)
      } finally {
        setDeletingSlot(null)
      }
    },
    [onDelete]
  )

  // --- Drag and drop for reordering filled slots ---
  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      if (index >= photos.length) return
      setDragSourceSlot(index)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', String(index))
    },
    [photos.length]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault()
      // Allow drop on filled slots for reorder, or on first empty slot for file drop
      if (dragSourceSlot !== null && index < photos.length) {
        e.dataTransfer.dropEffect = 'move'
        setDragOverSlot(index)
      } else if (dragSourceSlot === null && index >= photos.length) {
        // External file drag
        e.dataTransfer.dropEffect = 'copy'
        setDragOverSlot(index)
      }
    },
    [dragSourceSlot, photos.length]
  )

  const handleDragLeave = useCallback(() => {
    setDragOverSlot(null)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent, index: number) => {
      e.preventDefault()
      setDragOverSlot(null)

      // Reorder: drag from one filled slot to another
      if (dragSourceSlot !== null && index < photos.length && onReorder) {
        onReorder(dragSourceSlot, index)
        setDragSourceSlot(null)
        return
      }

      setDragSourceSlot(null)

      // External file drop on an empty slot
      if (index >= photos.length) {
        const files = e.dataTransfer.files
        if (files.length > 0) {
          setUploadingSlot(index)
          try {
            await onUpload(files[0])
          } catch (err) {
            console.error('Drop upload failed:', err)
          } finally {
            setUploadingSlot(null)
          }
        }
      }
    },
    [dragSourceSlot, photos.length, onReorder, onUpload]
  )

  const handleDragEnd = useCallback(() => {
    setDragSourceSlot(null)
    setDragOverSlot(null)
  }, [])

  const slots = Array.from({ length: MAX_SLOTS }, (_, i) => i)

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          width: '100%',
        }}
      >
        {slots.map((slotIndex) => {
          const isFilled = slotIndex < photos.length
          const isUploading = uploadingSlot === slotIndex
          const isDeleting = deletingSlot === slotIndex
          const isDragOver = dragOverSlot === slotIndex
          const isDragSource = dragSourceSlot === slotIndex

          return (
            <div
              key={slotIndex}
              onClick={() => !isFilled && handleSlotClick(slotIndex)}
              draggable={isFilled && !!onReorder}
              onDragStart={(e) => handleDragStart(e, slotIndex)}
              onDragOver={(e) => handleDragOver(e, slotIndex)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, slotIndex)}
              onDragEnd={handleDragEnd}
              style={{
                position: 'relative',
                aspectRatio: '3 / 4',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: isFilled ? (onReorder ? 'grab' : 'default') : 'pointer',
                border: isFilled
                  ? isDragOver
                    ? '2px solid #a855f7'
                    : '2px solid transparent'
                  : isDragOver
                    ? '2px solid #a855f7'
                    : '2px dashed #4b5563',
                backgroundColor: isFilled ? '#1f2937' : '#111827',
                opacity: isDragSource ? 0.5 : isDeleting ? 0.5 : 1,
                transition: 'border-color 0.2s, opacity 0.2s',
              }}
            >
              {isFilled ? (
                <>
                  {/* Photo */}
                  <img
                    src={photos[slotIndex]}
                    alt={`Photo ${slotIndex + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />

                  {/* Delete button overlay */}
                  <button
                    onClick={(e) => handleDelete(e, slotIndex)}
                    disabled={isDeleting}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                      padding: 0,
                    }}
                    aria-label={`Delete photo ${slotIndex + 1}`}
                  >
                    {isDeleting ? (
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          border: '2px solid #fff',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          display: 'inline-block',
                          animation: 'photo-grid-spin 0.6s linear infinite',
                        }}
                      />
                    ) : (
                      '\u00D7'
                    )}
                  </button>

                  {/* Slot number badge */}
                  {slotIndex === 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '6px',
                        left: '6px',
                        backgroundColor: '#a855f7',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      Main
                    </div>
                  )}
                </>
              ) : (
                /* Empty slot */
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    gap: '4px',
                  }}
                >
                  {isUploading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          border: '3px solid #4b5563',
                          borderTopColor: '#a855f7',
                          borderRadius: '50%',
                          display: 'inline-block',
                          animation: 'photo-grid-spin 0.8s linear infinite',
                        }}
                      />
                      <span style={{ fontSize: '12px' }}>Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span style={{ fontSize: '11px' }}>Add Photo</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Spinner keyframe animation */}
      <style>{`
        @keyframes photo-grid-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
