<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
      <h2 class="text-xl font-bold mb-4">Pozor!</h2>
      <p class="mb-4">
        Imaš <span class="font-semibold">{{ missedDays }}</span> zgrešenih dnevov. Označi jih zdaj.
      </p>
      <button
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        @click="markMissed"
      >
        Označi zdaj
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  missedDays: number
  onMark: () => Promise<void>
}>()

const show = ref(true)

async function markMissed() {
  await props.onMark()
  show.value = false
}
</script>
