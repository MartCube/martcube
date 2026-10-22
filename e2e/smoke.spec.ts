import { expect, test } from '@playwright/test'

test.describe('homepage', () => {
  test('loads the three slides without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))

    await page.goto('/')
    await expect(page).toHaveTitle('MartCube | Websites that move')
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Websites that move.')
    await expect(page.locator('main > section')).toHaveCount(3)
    // Only the slide that's showing is exposed; the others wait behind it.
    await expect(page.getByRole('region')).toHaveCount(1)
    expect(errors).toEqual([])
  })

  test('has share metadata', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /opengraph-image/)
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
  })

  test('"Start a project" goes straight to the contact form', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Start a project' }).first().click()
    await expect(page.getByRole('form', { name: 'Contact form' })).toBeInViewport({ ratio: 0.3 })
    await expect(page.locator('#services')).toBeHidden()
  })

  test('arrow keys step through the slides', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html[data-deck]')).toBeAttached()
    // The deck holds keys while the particles start (up to 3s on a slow CI machine), so retry until one lands.
    await expect(async () => {
      await page.keyboard.press('ArrowDown')
      await expect(page.getByRole('heading', { level: 1 })).toBeHidden({ timeout: 1500 })
    }).toPass()
    await expect(page.getByRole('link', { name: 'Move', exact: true })).toHaveAttribute('aria-current', 'true')
    // Keys pressed while a transition plays are ignored, so retry until this one lands.
    await expect(async () => {
      await page.keyboard.press('End')
      await expect(page.getByRole('form', { name: 'Contact form' })).toBeVisible({ timeout: 500 })
    }).toPass()
  })
})

test.describe('contact form', () => {
  test('shows errors, then sends', async ({ page }) => {
    await page.goto('/#contact')
    const form = page.getByRole('form', { name: 'Contact form' })
    await form.scrollIntoViewIfNeeded()

    await form.getByRole('button', { name: 'Send message' }).click()
    await expect(form.getByText('Required').first()).toBeVisible()

    await form.getByLabel('Name').fill('Ana Petrova')
    await form.getByLabel('Email').fill('ana@studio.mk')
    await form.getByLabel('Message').fill('We need a new store before spring.')
    await form.getByRole('button', { name: 'Send message' }).click()
    await expect(page.getByRole('heading', { name: 'Thanks, Ana.' })).toBeVisible({ timeout: 10_000 })
  })
})

test('unknown pages get the branded 404', async ({ page }) => {
  const response = await page.goto('/no-such-page')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page doesn’t exist.')
  await expect(page.getByRole('link', { name: 'Back to the homepage' })).toHaveAttribute('href', '/')
})

test('robots and sitemap are served', async ({ request }) => {
  expect((await request.get('/robots.txt')).ok()).toBe(true)
  expect(await (await request.get('/sitemap.xml')).text()).toContain('<loc>')
})
