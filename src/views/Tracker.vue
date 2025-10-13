<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Grid from '../components/Grid.vue'
import MissedDaysModal from '../components/MissedDaysModal.vue'
import { useAuthStore } from '../stores/auth'
import {
  fetchProgress as fetchProgressAPI,
  markMissedDays as markMissedAPI,
  tickToday as tickTodayAPI,
  type Progress,
} from '@/api/tick-repository'

const authStore = useAuthStore()
const userId = authStore.user?.id

const startDate = new Date(import.meta.env.VITE_START_DATE)
const endDate = new Date(import.meta.env.VITE_END_DATE)
const progress = ref<Progress | null>(null)
const successMessage = ref<string | null>(null)
const loading = ref(true) // track fetching progress

// Computed reactive lastTick for children
const lastTick = computed(() => {
  if (!progress.value?.last_tick_date) return null
  return new Date(progress.value.last_tick_date)
})

// Compute missed days (excluding today)
const missedDays = computed(() => {
  if (!progress.value) return 0

  const now = new Date()
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())

  let lastTickUTC: number
  const hasProgress = !!progress.value.last_tick_date

  if (hasProgress) {
    const d = new Date(progress.value.last_tick_date!)
    lastTickUTC = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  } else {
    lastTickUTC = Date.UTC(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      startDate.getUTCDate(),
    )
  }

  const diffDays = Math.floor((todayUTC - lastTickUTC) / (1000 * 60 * 60 * 24))

  // 💡 If there's progress, we skip the last ticked day itself
  // 💡 If there's no progress, we also count the start day (so +1)
  if (hasProgress) {
    return diffDays > 1 ? diffDays - 1 : 0
  } else {
    return diffDays > 0 ? diffDays : 0
  }
})

// Fetch progress from API
async function fetchProgress() {
  if (!userId) return
  loading.value = true
  try {
    const data = await fetchProgressAPI(userId)
    progress.value = data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Mark all missed days
async function markMissedDays() {
  if (!userId) return
  try {
    const updated = await markMissedAPI(userId)
    if (progress.value) progress.value.last_tick_date = updated.last_tick_date
  } catch (err) {
    console.error(err)
  }
}

// Tick today
async function tickToday() {
  if (!userId) return
  try {
    const updated = await tickTodayAPI(userId)
    if (progress.value) progress.value.last_tick_date = updated.last_tick_date

    successMessage.value = 'Danes je označeno!'
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchProgress)
</script>

<template>
  <!-- Success popup -->
  <div class="fixed top-5 right-5 z-50">
    <transition name="fade">
      <div v-if="successMessage" class="bg-green-500 text-white px-4 py-2 rounded shadow-lg">
        {{ successMessage }}
      </div>
    </transition>
  </div>

  <!-- Loader -->
  <div v-if="loading" class="flex justify-center items-center h-[70vh]">
    <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
  </div>

  <!-- Main content -->
  <div v-else class="flex flex-col md:flex-row p-6 gap-6">
    <MissedDaysModal v-if="missedDays > 0" :missedDays="missedDays" :onMark="markMissedDays" />

    <Sidebar
      :startDate="startDate"
      :endDate="endDate"
      :lastTick="lastTick"
      :onTick="tickToday"
      class="w-full md:w-72"
    />

    <Grid :startDate="startDate" :endDate="endDate" :lastTick="lastTick" class="flex-1" />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
