import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const backgroundType = formData.get('backgroundType') as string
    const themeId = formData.get('themeId') as string

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    if (!backgroundType || !['first', 'middle', 'last'].includes(backgroundType)) {
      return NextResponse.json({ error: 'Invalid background type' }, { status: 400 })
    }

    if (!themeId) {
      return NextResponse.json({ error: 'Theme ID is required' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert to PNG and resize to slide dimensions
    const pngBuffer = await sharp(buffer)
      .png({ quality: 80 })
      .resize(800, 1000, { fit: 'cover' })
      .toBuffer()

    // Convert to base64 for storage
    const base64Data = pngBuffer.toString('base64')
    
    // Validate base64 data length
    if (base64Data.length > 2000000) { // 2MB limit for theme background images
      return NextResponse.json({ error: 'Image too large after processing' }, { status: 400 })
    }
    
    const dataUrl = `data:image/png;base64,${base64Data}`

    return NextResponse.json({ 
      success: true, 
      filename: `theme-${themeId}-${backgroundType}.png`,
      dataUrl,
      base64Data,
      backgroundType,
      themeId
    })

  } catch (error) {
    console.error('Error uploading theme background:', error)
    return NextResponse.json({ error: 'Failed to upload theme background image' }, { status: 500 })
  }
} 