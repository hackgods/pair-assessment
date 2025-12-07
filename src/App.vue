<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}
</script>

