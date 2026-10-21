import { defineConfig, devices } from '@playwright/test'

// Smoke tests against the production build: `pnpm build` first, then `pnpm test:e2e`.
const port = 3100

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `pnpm start -p ${port}`,
    port,
    reuseExistingServer: !process.env.CI,
  },
})
