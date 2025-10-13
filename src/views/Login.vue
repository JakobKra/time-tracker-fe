<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        @click="login"
        class="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Login
      </button>

      <p v-if="error" class="mt-4 text-red-500 text-sm text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')

const router = useRouter()

async function login() {
  error.value = ''
  const { data, error: err } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (err) error.value = err.message
  else router.push('/')
}
</script>
