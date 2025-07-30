import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slideNumber = searchParams.get('slideNumber')

    if (!slideNumber) {
      return NextResponse.json({ error: 'No slide number provided' }, { status: 400 })
    }

    // Since images are now stored as base64 data URLs in the client,
    // we just return success - the client will handle the actual removal
    return NextResponse.json({ 
      success: true, 
      message: `Image for slide ${slideNumber} marked for deletion` 
    })

  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
} 