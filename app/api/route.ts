import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/internal'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }

  // Redirect to appropriate login on failure
  const loginPath = next.startsWith('/vip') ? '/vip/login' :
                    next.startsWith('/investor') ? '/investor/login' : '/internal/login'
  return NextResponse.redirect(`${origin}${loginPath}?error=auth_failed`)
}
