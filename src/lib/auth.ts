import { supabase } from './supabase'

export const getCurrentUserId = async (): Promise<string> => {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    throw new Error('로그인이 필요합니다.')
  }

  return session.user.id
}
