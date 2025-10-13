<template>
  <div class="calendar-grid">
    <!-- Weekday headers -->
    <div
      class="weekday"
      v-for="(day, i) in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
      :key="i"
    >
      {{ day }}
    </div>

    <!-- Calendar days -->
    <div
      v-for="(day, index) in days"
      :key="index"
      class="day"
      :class="{
        'bg-gray-100': day.blank,
        'bg-green-500': day.checked && !day.blank,
        'bg-yellow-300': day.missing,
        'bg-gray-200': day.future && !day.blank,
        'border-orange-500 border-2': day.today,
      }"
      :title="day.blank ? '' : day.date.toDateString()"
    >
      <span v-if="!day.blank">{{ day.date.getDate() }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  startDate: Date
  endDate: Date
  lastTick: Date | null
}>()

const msPerDay = 24 * 60 * 60 * 1000
const today = new Date()
today.setHours(0, 0, 0, 0)

const totalDays = computed(() => {
  return Math.floor((props.endDate.getTime() - props.startDate.getTime()) / msPerDay) + 1
})

const days = computed(() => {
  const arr: {
    date: Date
    checked: boolean
    missing: boolean
    future: boolean
    today: boolean
    blank?: boolean
  }[] = []

  // Calculate blanks before first weekday
  const startWeekday = props.startDate.getDay() || 7 // Sunday = 7
  for (let i = 1; i < startWeekday; i++) {
    arr.push({
      date: new Date(),
      checked: false,
      missing: false,
      future: false,
      today: false,
      blank: true,
    })
  }

  for (let i = 0; i < totalDays.value; i++) {
    const date = new Date(props.startDate.getTime() + i * msPerDay)
    date.setHours(0, 0, 0, 0)

    const isToday = date.getTime() === today.getTime()
    const checked = props.lastTick ? date.getTime() <= props.lastTick.getTime() : false
    const missing = !checked && date.getTime() < today.getTime()
    const future = date.getTime() > today.getTime()

    arr.push({
      date,
      checked,
      missing,
      future,
      today: isToday,
    })
  }

  return arr
})
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 40px);
  gap: 2px;
  justify-content: center;
}

.weekday {
  text-align: center;
  font-weight: bold;
  font-size: 0.8rem;
}

.day {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 500;
}
</style>
