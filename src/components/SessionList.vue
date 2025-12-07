<template>
  <ul v-if="sessions.length > 0" role="list" class="space-y-4">
    <SessionItem
      v-for="session in sessions"
      :key="session.id"
      :session="session"
      :is-completed="isCompleted(session)"
      :search-term="searchTerm"
      @toggle-complete="toggleComplete"
    />
  </ul>
  <div v-else class="bg-white rounded-xl shadow p-8 text-center">
    <p class="text-gray-600">No sessions found matching your search.</p>
  </div>
</template>

<script setup>
import SessionItem from './SessionItem.vue'

defineProps({
  sessions: {
    type: Array,
    required: true,
  },
  isCompleted: {
    type: Function,
    required: true,
  },
  toggleComplete: {
    type: Function,
    required: true,
  },
  searchTerm: {
    type: String,
    default: '',
  },
})
</script>

