import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any | null>(null)
  const initialized = ref(false)

  async function init() {
    // Load current session
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null
    initialized.value = true

    // Listen for changes (login/logout)
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    user.value = data.user
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  return { user, initialized, init, login, logout }
})
