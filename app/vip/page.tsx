import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import VIPPortalClient from './VIPPortalClient'

export default async function VIPPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/vip/login')
  if (user.user_metadata?.role !== 'vip') redirect('/vip/login?error=vip_required')

  const admin = createAdminClient()
  const { data: docs } = await admin
    .from('documents')
    .select('*')
    .order('created_at')

  return <VIPPortalClient user={user} docs={docs || []} />
}
