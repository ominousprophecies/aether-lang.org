import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const filename = req.nextUrl.searchParams.get('file')
  if (!filename) return NextResponse.json({ error: 'Missing file param' }, { status: 400 })

  // Verify user is authenticated
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Look up document in DB — check category access
  const admin = createAdminClient()
  const { data: doc } = await admin
    .from('documents')
    .select('category, filename')
    .eq('filename', filename)
    .single()

  if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })

  // VIP-only docs require vip role
  if (doc.category === 'vip' && user.user_metadata?.role !== 'vip') {
    return NextResponse.json({ error: 'VIP access required' }, { status: 403 })
  }

  // Generate signed URL (1 hour)
  const { data: urlData, error: urlError } = await admin.storage
    .from('documents')
    .createSignedUrl(doc.filename, 3600)

  if (urlError || !urlData) {
    return NextResponse.json({ error: 'Could not generate download URL' }, { status: 500 })
  }

  return NextResponse.json({ url: urlData.signedUrl })
}
