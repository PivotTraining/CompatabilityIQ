'use client'

import { useState } from 'react'
import { CheckCircle, Clock, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import PhotoModerationActions from './PhotoModerationActions'

interface PendingPhoto {
  id: string
  firstName: string
  uploadedAt: string
  signedUrl: string | null
}

interface PhotoModerationGridProps {
  initialPhotos: PendingPhoto[]
}

export default function PhotoModerationGrid({ initialPhotos }: PhotoModerationGridProps) {
  const [photos, setPhotos] = useState<PendingPhoto[]>(initialPhotos)

  function handleModerated(photoId: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId))
  }

  const pendingCount = photos.length

  return (
    <div>
      {/* Pending count badge */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 inline-flex items-center gap-2">
        <Clock className="w-4 h-4 text-amber-500" />
        <span className="text-sm font-medium text-gray-700">
          {pendingCount} photo{pendingCount !== 1 ? 's' : ''} pending review
        </span>
      </div>

      {pendingCount === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
          <h2 className="text-lg font-semibold text-gray-900 mb-1">No photos pending review</h2>
          <p className="text-sm text-gray-500">All uploaded photos have been moderated.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Photo thumbnail */}
              <div className="aspect-[3/4] relative bg-gray-50">
                {photo.signedUrl ? (
                  <Image
                    src={photo.signedUrl}
                    alt={`Photo by ${photo.firstName}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Info + actions */}
              <div className="p-3 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{photo.firstName}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(photo.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <PhotoModerationActions
                  photoId={photo.id}
                  onModerated={handleModerated}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
