import { createClient } from 'jsr:@supabase/supabase-js@2'

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

Deno.serve(async (req) => {
  const cronSecret = Deno.env.get('CRON_SECRET')
  if (cronSecret && req.headers.get('x-cron-secret') !== cronSecret) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const now = new Date()
  const year = now.getUTCFullYear()
  // 매월 말일 실행 기준 — 직전 달이 리포트 대상
  const reportMonth = now.getUTCMonth() === 0
    ? `${year - 1}-12`
    : `${year}-${String(now.getUTCMonth()).padStart(2, '0')}`

  // --- AI 리포트 생성 로직 (추후 구현) ---
  // 1. reportMonth 기간 transactions 조회
  // 2. AI 분석 (Claude API 등) 호출
  // 3. 결과를 monthly_reports 테이블에 저장
  // 4. 저장 성공 시 아래 Push 발송
  // ----------------------------------------

  // Push 발송 대상: 알림이 켜진 사용자
  const { data: settings, error } = await supabase
    .from('notification_settings')
    .select('user_id, push_token')
    .eq('enabled', true)
    .not('push_token', 'is', null)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  if (!settings?.length) return Response.json({ sent: 0, reportMonth })

  const messages = settings.map((s) => ({
    to: s.push_token,
    title: '📊 월간 리포트 도착',
    body: `${reportMonth} 소비 리포트가 준비됐어요. 확인해보세요!`,
    sound: 'default',
    data: { screen: 'monthly-report', month: reportMonth },
  }))

  const expoRes = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messages),
  })
  const expoData = await expoRes.json()

  return Response.json({ sent: settings.length, reportMonth, tickets: expoData })
})
