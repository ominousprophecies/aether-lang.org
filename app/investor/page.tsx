import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import InvestorPortalClient from './InvestorPortalClient'

export default async function InvestorPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/investor/login')
  if (user.user_metadata?.role !== 'investor') redirect('/investor/login?error=not_invited')

  return <InvestorPortalClient user={user} />
}
