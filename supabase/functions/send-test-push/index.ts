import { createClient } from 'jsr:@supabase/supabase-js@2'

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  )

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: settings, error: settingsError } = await supabase
    .from('notification_settings')
    .select('push_token')
    .eq('user_id', user.id)
    .maybeSingle()

  if (settingsError) {
    return Response.json({ error: 'DB error' }, { status: 500 })
  }

  if (!settings?.push_token) {
    return Response.json({ error: 'push_token not found' }, { status: 404 })
  }

  const expoRes = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: settings.push_token,
      title: '10log 알림 테스트',
      body: '알림이 정상적으로 설정됐어요.',
      sound: 'default',
    }),
  })

  const expoData = await expoRes.json()

  const ticket = expoData?.data?.[0] ?? expoData
  if (ticket?.status === 'error') {
    return Response.json({ error: ticket.message, details: ticket }, { status: 500 })
  }

  return Response.json({ ok: true, ticket })
})
