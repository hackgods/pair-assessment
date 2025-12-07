1. Where do you coerce `mins` to a number and why there?  
I coerce `mins` to a number in the `loadSessions` function, when I map over the raw data returned from `fakeFetchSessions`. Doing it once at the data boundary keeps the rest of the app working with a consistent numeric type and avoids repeated coercion in rendering and sorting.

2. How did you implement the debounce and why that approach?
I watch `searchInput` and use `setTimeout` with a 300ms delay to update a separate `debouncedSearch` ref, cancelling the previous timer each time. This keeps the implementation simple and avoids extra libraries like lodash.

3. If two sessions share the same popularity, what guarantees their relative order? 
When normalising the data I attach an `index` field based on original position. The sort comparator falls back to this index when popularity is equal, which preserves the original order and makes the sort stable.

4. What’s your approach to accessibility for the toggle?
The completion control is a native `<button>` with clear text, `aria-pressed` reflecting the current state, and descriptive `aria-label`/`title`. Using a real button gives built-in keyboard support (Tab, Enter, Space) and lets screen readers announce it correctly as a toggle without custom key handling.
