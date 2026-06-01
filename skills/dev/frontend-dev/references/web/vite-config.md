# Vite Configuration

Standard Vite config for React + Tailwind CSS v4.

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

## Key Points
- React plugin: `@vitejs/plugin-react` for JSX/TSX support
- Tailwind plugin: `@tailwindcss/vite` for native Tailwind v4 integration (no PostCSS needed)
- No additional CSS config required — Tailwind is handled by the Vite plugin directly
