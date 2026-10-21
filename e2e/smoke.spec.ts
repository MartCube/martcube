import { expect, test } from '@playwright/test'

test.describe('homepage', () => {
  test('loads the three slides without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))

    await page.goto('/')
    await expect(page).toHaveTitle('MartCube | Websites that move')
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Websites that move.')
    await expect(page.getByRole('region')).toHaveCount(3)
    expect(errors).toEqual([])
  })

  test('has share metadata', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /opengraph-image/)
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
  })

  test('"Start a project" brings the contact form into view', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Start a project' }).click()
    await expect(page.getByRole('form', { name: 'Contact form' })).toBeInViewport({ ratio: 0.3 })
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
    await expect(page.getByRole('heading', { name: 'Message sent.' })).toBeVisible({ timeout: 10_000 })
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
