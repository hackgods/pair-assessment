import sessionsData from '../data/sessions.json'

export async function fakeFetchSessions({ shouldError = false } = {}) {
  // Simulate network delay (500ms)
  await new Promise(resolve => setTimeout(resolve, 500))

  if (shouldError) {
    throw new Error('Failed to load sessions. Please try again.')
  }

  // Return copy of the data to avoid mutations
  return JSON.parse(JSON.stringify(sessionsData))
}

