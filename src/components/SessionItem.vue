<template>
    <li role="listitem" class="bg-white rounded-xl shadow p-5 hover:shadow-md transition-shadow">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex-1">
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ session.title }}
            </h3>
  
            <span
              v-if="session.difficulty"
              :class="[
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                difficultyBadgeClass
              ]"
            >
              {{ session.difficulty }}
            </span>
  
            <span v-else class="text-xs text-gray-500">
              N/A
            </span>
          </div>
  
          <div class="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-1">
            <span>
              {{ session.mins }} min{{ session.mins !== 1 ? 's' : '' }}
            </span>
  
            <span class="text-gray-400">·</span>
  
            <span class="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-800">
              Popularity: {{ session.popularity }}
            </span>
          </div>
  
          <div class="mt-1 text-xs sm:text-sm text-gray-600">
            <span class="font-medium text-gray-700">Tags:</span>
            <span v-if="session.tags && session.tags.length > 0">
              {{ session.tags.join(', ') }}
            </span>
            <span v-else class="text-gray-500">
              -
            </span>
          </div>
        </div>
  
        <div class="flex-shrink-0">
          <button
            type="button"
            @click="$emit('toggle-complete', session.id)"
            :aria-pressed="isCompleted"
            :aria-label="isCompleted ? 'Mark session as incomplete' : 'Mark session as complete'"
            :title="isCompleted ? 'Mark session as incomplete' : 'Mark session as complete'"
            class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            :class="isCompleted
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
          >
            <span class="mr-1.5 h-2 w-2 rounded-full"
                  :class="isCompleted ? 'bg-green-500' : 'bg-gray-400'">
            </span>
            <span>
              {{ isCompleted ? 'Completed' : 'Mark complete' }}
            </span>
          </button>
        </div>
      </div>
    </li>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    session: {
      type: Object,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      required: true,
    },
  })
  
  defineEmits(['toggle-complete'])
  
  const difficultyBadgeClass = computed(() => {
    const difficulty = props.session.difficulty?.toLowerCase()
    if (difficulty === 'beginner') {
      return 'bg-green-100 text-green-800'
    } else if (difficulty === 'intermediate') {
      return 'bg-yellow-100 text-yellow-800'
    } else if (difficulty === 'advanced') {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-gray-100 text-gray-800'
  })
  </script>
  