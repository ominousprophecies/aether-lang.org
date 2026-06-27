import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import InternalPortalClient from './InternalPortalClient'

export default async function InternalPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/internal/login')

  // Fetch documents list
  const admin = createAdminClient()
  const { data: docs } = await admin
    .from('documents')
    .select('*')
    .in('category', ['internal', 'public'])
    .order('created_at')

  return <InternalPortalClient user={user} docs={docs || []} />
}
