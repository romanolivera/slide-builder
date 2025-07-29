import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slideNumber = searchParams.get('slideNumber')

    if (!slideNumber) {
      return NextResponse.json({ error: 'No slide number provided' }, { status: 400 })
    }

    const filename = `slide${slideNumber}.png`
    const filepath = join(process.cwd(), 'public', filename)

    try {
      await unlink(filepath)
      return NextResponse.json({ 
        success: true, 
        message: `Deleted ${filename}` 
      })
    } catch (error) {
      // File doesn't exist, which is fine
      return NextResponse.json({ 
        success: true, 
        message: `File ${filename} not found` 
      })
    }

  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
} 