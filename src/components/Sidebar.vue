<script setup lang="ts">
import { computed } from 'vue'

// Props
const props = defineProps<{
  startDate: Date
  endDate: Date
  lastTick: Date | null
  onTick: () => Promise<void>
}>()

// Loading state for buttons (if needed)
const loading = false // replace with reactive if you have async actions

// Total checked days
const totalChecked = computed(() => {
  if (!props.lastTick) return 0
  const start = props.startDate.getTime()
  const last = props.lastTick.getTime()
  const diffDays = Math.floor((last - start) / (1000 * 60 * 60 * 24)) + 1
  return Math.max(0, diffDays)
})

// Total days in semester
const totalDays = computed(() => {
  const start = props.startDate.getTime()
  const end = props.endDate.getTime()
  const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1
  return Math.max(1, diffDays)
})

// Remaining days
const remaining = computed(() => totalDays.value - totalChecked.value)

// Percent complete
const percent = computed(() => Math.floor((totalChecked.value / totalDays.value) * 100))

// Motivation text in Slovenian
const motivation = computed(() => {
  const c = totalChecked.value
  const t = totalDays.value
  const progress = c / t

  if (progress === 0) return 'Začniva! 🌱 Komaj čakam vsak dan s tabo!'
  if (progress > 0 && progress <= 0.15) return 'Uf, prvi dnevi 🌿 Še malo do četrtine! 💖'
  if (progress > 0.15 && progress <= 0.25) return 'Yeey! 🌸 Četrtina je tu, samo še 3x toliko 😘'
  if (progress > 0.25 && progress <= 0.4) return 'Že napredujeva 🌼 Polovica ni več tak daleč ✨'
  if (progress > 0.4 && progress <= 0.55) return 'Uf, že polovica! 💛 Še enkrat tolko in bo 😍'
  if (progress > 0.55 && progress <= 0.7)
    return 'Več kot polovica! 💖 Še malo do pa sma proti koncu 🌷'
  if (progress > 0.7 && progress <= 0.85) return 'Skoraj na koncu 🌹 Samo še zadnji koraki 😘'
  if (progress > 0.85 && progress < 1) return 'Zadnji dnevi… ❤️ Končno bo 💌'
  return 'Končno skupaj!!'
})

// Message based on last tick
const today = new Date()
today.setHours(0, 0, 0, 0)

const message = computed(() => {
  if (!props.lastTick) return 'Nič še odljukano'

  const last = new Date(props.lastTick)
  last.setHours(0, 0, 0, 0)

  const start = new Date(props.startDate)
  start.setHours(0, 0, 0, 0)

  // yesterday = today - 1 day
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (last.getTime() === today.getTime()) {
    return 'Vse označeno'
  } else if (last.getTime() === yesterday.getTime()) {
    return 'Manjka današnji dan'
  } else if (last.getTime() < yesterday.getTime()) {
    return 'Manjkajo današnji in prejšnji dnevi'
  }
})

const canTickToday = computed(() => {
  if (!props.lastTick) return true
  const last = new Date(props.lastTick)
  last.setHours(0, 0, 0, 0)
  return last < today
})

async function tickToday() {
  await props.onTick()
}
</script>

<template>
  <aside class="w-full md:w-72 bg-gray-50 rounded-lg shadow-md p-5 flex flex-col space-y-4">
    <h1 class="text-2xl font-bold text-center md:text-left">Semester Tracker</h1>

    <!-- Top section: progress texts -->
    <div class="flex flex-row justify-between">
      <div class="flex flex-col space-y-2">
        <p>
          Vsi odkljukani: <span class="text-green-600 font-semibold">{{ totalChecked }}</span>
        </p>
        <p>
          Preostalo: <span class="text-red-600 font-semibold">{{ remaining }}</span>
        </p>
        <p>
          Napredek: <span class="text-blue-600 font-semibold">{{ percent }}%</span>
        </p>
      </div>
      <!-- Buttons ONLY visible on mobile here -->
      <div class="flex flex-col gap-2 mt-2 md:hidden">
        <button
          class="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 p-3"
          :disabled="!canTickToday || loading"
          @click="tickToday"
        >
          Označi danes
        </button>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
      <div
        class="h-full bg-green-500 transition-all duration-300"
        :style="{ width: percent + '%' }"
      ></div>
    </div>

    <!-- Motivation and message -->
    <p class="italic text-gray-700">{{ motivation }}</p>
    <p class="text-gray-800 font-medium">{{ message }}</p>

    <!-- Buttons ONLY visible on desktop -->
    <div class="hidden md:flex flex-col gap-2 w-full">
      <button
        class="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        :disabled="!canTickToday || loading"
        @click="tickToday"
      >
        Označi danes
      </button>
    </div>
  </aside>
</template>
