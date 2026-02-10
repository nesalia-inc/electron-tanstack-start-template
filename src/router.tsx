import { createRouter } from '@tanstack/react-router'
import { createMemoryHistory } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Check if running in Electron
const isElectron = () => {
  return !!(window && window.process && window.process.type === 'renderer')
}

// Create a memory history instance for Electron
const memoryHistory = createMemoryHistory({
  initialEntries: ['/'],
})

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    // Use memory history for Electron, default (browser history) for web
    history: isElectron() ? memoryHistory : undefined,
    context: {},

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  })

  return router
}
