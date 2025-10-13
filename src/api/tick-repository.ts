import { supabase } from '../supabase'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

export interface Progress {
  ticks: number
  last_tick_date: string | null
}

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) throw new Error('User not logged in')
  return {
    Authorization: `Bearer ${session.access_token}`,
  }
}

export async function fetchProgress(userId: string): Promise<Progress> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/progress/${userId}`, { headers })
  if (!res.ok) throw new Error('Failed to fetch progress')
  return res.json()
}

export async function markMissedDays(userId: string) {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/mark-missed/${userId}`, {
    method: 'POST',
    headers,
  })
  if (!res.ok) throw new Error('Failed to mark missed days')
  return res.json()
}

export async function tickToday(userId: string) {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/tick-today/${userId}`, {
    method: 'POST',
    headers,
  })
  if (!res.ok) throw new Error('Failed to tick today')
  return res.json()
}
