import { createClient } from 'jsr:@supabase/supabase-js@2'

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'
const WINDOW_MINUTES = 5

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

  const { data: settings, error } = await supabase
    .from('notification_settings')
    .select('user_id, push_token, frequency, notification_time, weekday, timezone, last_sent_at')
    .eq('enabled', true)
    .not('push_token', 'is', null)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  if (!settings?.length) return Response.json({ sent: 0 })

  const toSend: typeof settings = []

  for (const s of settings) {
    const { frequency, notification_time, weekday, timezone, last_sent_at } = s

    // 사용자 timezone 기준 현재 시각
    const userNow = toUserDate(now, timezone)
    const userMinutes = userNow.getHours() * 60 + userNow.getMinutes()

    // notification_time은 PostgreSQL time 타입 → "HH:MM:SS" 형식
    const [h, m] = notification_time.split(':').map(Number)
    const notifMinutes = h * 60 + m

    // 알림 시간 이후 WINDOW_MINUTES 이내인지 확인
    const diff = userMinutes - notifMinutes
    if (diff < 0 || diff >= WINDOW_MINUTES) continue

    // weekly: 오늘 요일이 설정된 요일인지 확인 (ISO: 1=월, 7=일)
    if (frequency === 'weekly') {
      const isoToday = isoWeekday(userNow)
      if (isoToday !== weekday) continue
    }

    // 이번 주기에서 이미 발송했는지 확인
    if (last_sent_at) {
      const lastUser = toUserDate(new Date(last_sent_at), timezone)
      if (frequency === 'daily' && isSameDay(lastUser, userNow)) continue
      if (frequency === 'weekly' && isSameISOWeekAndDay(lastUser, userNow, weekday)) continue
    }

    toSend.push(s)
  }

  if (!toSend.length) return Response.json({ sent: 0 })

  const messages = toSend.map((s) => ({
    to: s.push_token,
    title: '10log',
    body: '오늘 가계부 기록하셨나요?',
    sound: 'default',
  }))

  const expoRes = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messages),
  })
  const expoData = await expoRes.json()

  const tickets: { status: string; details?: { error?: string } }[] =
    Array.isArray(expoData?.data) ? expoData.data : []

  const sentAt = now.toISOString()
  await Promise.all(
    toSend.map((s, i) => {
      const ticket = tickets[i]
      // 앱 삭제 등으로 token이 무효화된 경우 push_token 정리
      if (ticket?.status === 'error' && ticket?.details?.error === 'DeviceNotRegistered') {
        return supabase
          .from('notification_settings')
          .update({ push_token: null })
          .eq('user_id', s.user_id)
      }
      return supabase
        .from('notification_settings')
        .update({ last_sent_at: sentAt })
        .eq('user_id', s.user_id)
    }),
  )

  return Response.json({ sent: toSend.length, tickets })
})

function toUserDate(date: Date, timezone: string): Date {
  return new Date(date.toLocaleString('en-US', { timeZone: timezone }))
}

function isoWeekday(date: Date): number {
  const d = date.getDay() // 0=일
  return d === 0 ? 7 : d
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isSameISOWeekAndDay(last: Date, now: Date, weekday: number): boolean {
  if (isoWeekday(last) !== weekday) return false
  // 같은 ISO 주차인지: now에서 해당 요일로 돌아간 날짜와 last의 날짜 비교
  const nowMondayOffset = isoWeekday(now) - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - nowMondayOffset)
  monday.setHours(0, 0, 0, 0)
  return last >= monday
}
