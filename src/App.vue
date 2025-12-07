<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Learning Sessions Browser</h1>

      <div class="bg-white rounded-xl shadow p-6 mb-6">

        <div class="mb-4">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
            Search Sessions
          </label>
          <input
            id="search"
            v-model="searchInput"
            type="text"
            placeholder="Search by title"
            aria-describedby="search-description"
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p id="search-description" class="sr-only">Search sessions by title</p>
        </div>

        <div class="mb-4">
          <label for="sort" class="block text-sm font-medium text-gray-700 mb-2">
            Sort by Popularity
          </label>
          <select
            id="sort"
            v-model="sortDirection"
            class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="desc">Descending (High to Low)</option>
            <option value="asc">Ascending (Low to High)</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="flex items-center">
            <input
              id="simulate-error"
              v-model="simulateErrorNext"
              type="checkbox"
              class="mr-2"
              aria-describedby="simulate-error-description"
            />
            <span class="text-sm text-gray-700">Simulate error on next load</span>
          </label>
          <p id="simulate-error-description" class="sr-only">When checked, the next attempt to load sessions will fail to demonstrate error handling</p>
        </div>

        <div>
          <button
            type="button"
            @click="loadSessions"
            :aria-label="loading ? 'Loading sessions, please wait' : 'Reload sessions'"
            :title="loading ? 'Loading sessions, please wait' : 'Reload sessions'"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            :disabled="loading"
          >
            {{ loading ? 'Loading...' : 'Reload Sessions' }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="bg-white rounded-xl shadow p-8 text-center" aria-busy="true">
        <div class="text-gray-600" aria-live="polite">Loading sessions</div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6" role="alert">
        <p class="text-red-800 mb-4">{{ error }}</p>
        <button
          type="button"
          @click="loadSessions"
          aria-label="Retry loading sessions"
          title="Retry loading sessions"
          class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Retry
        </button>
      </div>

      <div v-else>
        <div v-if="filteredSessions.length > 0" class="sr-only" aria-live="polite" aria-atomic="true">
          Showing {{ filteredSessions.length }} session{{ filteredSessions.length !== 1 ? 's' : '' }}
        </div>
        <SessionList
          :sessions="filteredSessions"
          :is-completed="isCompleted"
          :toggle-complete="toggleComplete"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { fakeFetchSessions } from './utils/fetch.js'
import SessionList from './components/SessionList.vue'

const sessions = ref([])
const completionMap = ref({})
const searchInput = ref('')
const debouncedSearch = ref('')
const sortDirection = ref('desc')
const loading = ref(false)
const error = ref(null)
const simulateErrorNext = ref(false)

// Debounce search input (300ms)
let debounceTimer = null
watch(searchInput, (newValue) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    debouncedSearch.value = newValue
  }, 300)
})

const loadSessions = async () => {
  loading.value = true
  error.value = null

  const shouldError = simulateErrorNext.value

  try {
    const rawSessions = await fakeFetchSessions({ shouldError })
    
    // Coerce mins to number and add index for stable sorting
    sessions.value = rawSessions.map((session, index) => ({
      ...session,
      mins: Number(session.mins),
      index,
    }))
  } catch (err) {
    error.value = err.message
  } finally {
    // Reset error simulation flag after fetch attempt
    simulateErrorNext.value = false
    loading.value = false
  }
}

const filteredSessions = computed(() => {
  let result = sessions.value

  if (debouncedSearch.value.trim()) {
    const searchLower = debouncedSearch.value.toLowerCase()
    result = result.filter(session =>
      session.title.toLowerCase().includes(searchLower)
    )
  }

  // Sort by popularity with stable ordering
  result = [...result].sort((a, b) => {
    const diff = b.popularity - a.popularity
    if (diff !== 0) {
      return sortDirection.value === 'desc' ? diff : -diff
    }
    // If popularity is equal, use original index
    return a.index - b.index
  })

  return result
})

const toggleComplete = (id) => {
  completionMap.value[id] = !(completionMap.value[id] ?? sessions.value.find(s => s.id === id)?.completed ?? false)
}

const isCompleted = (session) => {
  return completionMap.value[session.id] ?? session.completed ?? false
}

onMounted(() => {
  loadSessions()
})
</script>
