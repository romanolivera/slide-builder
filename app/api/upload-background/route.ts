import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const backgroundType = formData.get('backgroundType') as string

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    if (!backgroundType || !['first', 'middle', 'last'].includes(backgroundType)) {
      return NextResponse.json({ error: 'Invalid background type' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert to PNG and resize to slide dimensions
    const pngBuffer = await sharp(buffer)
      .png()
      .resize(1080, 1350, { fit: 'cover' })
      .toBuffer()

    // Ensure public directory exists
    const publicDir = join(process.cwd(), 'public')
    await mkdir(publicDir, { recursive: true })

    // Save the PNG file with appropriate name
    const filename = `bg${backgroundType === 'first' ? '1' : backgroundType === 'middle' ? '2' : '3'}.png`
    const filepath = join(publicDir, filename)
    await writeFile(filepath, pngBuffer)

    return NextResponse.json({ 
      success: true, 
      filename,
      url: `/${filename}`,
      backgroundType
    })

  } catch (error) {
    console.error('Error uploading background:', error)
    return NextResponse.json({ error: 'Failed to upload background image' }, { status: 500 })
  }
} 