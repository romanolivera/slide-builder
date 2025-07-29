"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  slideNumber: number
  currentImageUrl?: string
  onImageUploaded: (imageUrl: string) => void
}

export function ImageUpload({ slideNumber, currentImageUrl, onImageUploaded }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }

    setIsUploading(true)
    setUploadError(null)
    setUploadSuccess(false)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('slideNumber', slideNumber.toString())

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const result = await response.json()
      
      if (result.success) {
        onImageUploaded(result.url)
        setUploadSuccess(true)
        // Clear success message after 3 seconds
        setTimeout(() => setUploadSuccess(false), 3000)
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    try {
      const response = await fetch(`/api/delete-image?slideNumber=${slideNumber}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onImageUploaded('')
      }
    } catch (error) {
      console.error('Delete error:', error)
      // Even if delete fails, we can still remove from UI
      onImageUploaded('')
    }
  }

  return (
    <div className="relative group">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Image display area */}
      <div 
        className="relative w-full h-full min-h-[120px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition-colors"
        onClick={handleImageClick}
        style={{ width: '100%' }}
      >
        {currentImageUrl ? (
          <>
            <Image
              src={currentImageUrl}
              alt={`Slide ${slideNumber} content`}
              width={120}
              height={80}
              className="object-cover rounded-lg max-w-full max-h-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = `/placeholder.svg?height=80&width=120&query=slide-${slideNumber}-content`
              }}
            />
            {/* Remove button overlay */}
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveImage()
              }}
            >
              <X size={16} />
            </Button>
          </>
        ) : (
                      <div className="text-center">
              <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                {isUploading ? 'Uploading...' : 'Click to add image'}
              </p>
              {uploadError && (
                <p className="text-xs text-red-500 mt-1">{uploadError}</p>
              )}
              {!isUploading && !uploadError && !uploadSuccess && (
                <p className="text-xs text-blue-500 mt-1">Image will appear in slide preview</p>
              )}
              {uploadSuccess && (
                <p className="text-xs text-green-500 mt-1">✓ Image uploaded successfully!</p>
              )}
            </div>
        )}
      </div>
    </div>
  )
} 