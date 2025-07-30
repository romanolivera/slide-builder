import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const slideNumber = formData.get('slideNumber') as string

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    if (!slideNumber) {
      return NextResponse.json({ error: 'No slide number provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 1MB)
    if (file.size > 1 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 1MB' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert to JPEG using sharp and resize to very small dimensions
    const jpegBuffer = await sharp(buffer)
      .jpeg({ quality: 60 })
      .resize(200, 150, { fit: 'cover' })
      .toBuffer()

    // Convert to base64 for storage
    const base64Data = jpegBuffer.toString('base64')
    
    // Validate base64 data length (250KB limit)
    if (base64Data.length > 250000) {
      return NextResponse.json({ error: 'Image too large after processing' }, { status: 400 })
    }
    
    const dataUrl = `data:image/jpeg;base64,${base64Data}`

    return NextResponse.json({ 
      success: true, 
      filename: `slide${slideNumber}.jpg`,
      dataUrl,
      base64Data
    })

  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
} 