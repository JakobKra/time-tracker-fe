import { supabase } from '../supabase'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

export interface Progress {
  ticks: number
  last_tick_date: string | null
}

export interface MissingDays {
  missingDates: string[]
}

// Helper to get auth headers
async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) throw new Error('User not logged in')
  return {
    Authorization: `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  }
}

// Fetch user progress
export async function fetchProgress(userId: string): Promise<Progress> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/progress/${userId}`, { headers })
  if (!res.ok) throw new Error('Failed to fetch progress')
  return res.json()
}

// Mark all missed days (excluding today)
export async function markMissedDays(userId: string) {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/mark-missed/${userId}`, {
    method: 'POST',
    headers,
  })
  if (!res.ok) throw new Error('Failed to mark missed days')
  return res.json()
}

// Tick today
export async function tickToday(userId: string) {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/tick-today/${userId}`, {
    method: 'POST',
    headers,
  })
  if (!res.ok) throw new Error('Failed to tick today')
  return res.json()
}
