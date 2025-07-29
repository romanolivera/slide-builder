import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
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

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert to PNG and resize to slide dimensions
    const pngBuffer = await sharp(buffer)
      .png()
      .resize(1080, 1350, { fit: 'cover' })
      .toBuffer()

    // Ensure themes directory exists
    const themesDir = join(process.cwd(), 'public', 'themes')
    await mkdir(themesDir, { recursive: true })

    // Save the PNG file with unique name based on theme ID and background type
    const filename = `theme-${themeId}-${backgroundType}.png`
    const filepath = join(themesDir, filename)
    await writeFile(filepath, pngBuffer)

    return NextResponse.json({ 
      success: true, 
      filename,
      url: `/themes/${filename}`,
      backgroundType,
      themeId
    })

  } catch (error) {
    console.error('Error uploading theme background:', error)
    return NextResponse.json({ error: 'Failed to upload theme background image' }, { status: 500 })
  }
} 