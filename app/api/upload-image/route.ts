import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
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

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert to PNG using sharp
    const pngBuffer = await sharp(buffer)
      .png()
      .resize(600, 400, { fit: 'cover' })
      .toBuffer()

    // Ensure public directory exists
    const publicDir = join(process.cwd(), 'public')
    await mkdir(publicDir, { recursive: true })

    // Save the PNG file
    const filename = `slide${slideNumber}.png`
    const filepath = join(publicDir, filename)
    await writeFile(filepath, pngBuffer)

    return NextResponse.json({ 
      success: true, 
      filename,
      url: `/${filename}`
    })

  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
} 