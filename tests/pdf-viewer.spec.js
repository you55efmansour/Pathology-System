import { readFile } from 'node:fs/promises';
import { test, expect } from '@playwright/test';

async function seedFinal(page, { long = false, missingImage = false } = {}) {
  await page.goto('/cases');
  await page.evaluate(({ long, missingImage }) => {
    const data = JSON.parse(localStorage.getItem('histora:cases:v1'));
    const item = data.records.find((record) => record.id === 'demo-242');
    item.report = { type: 'custom', text: long ? `Demonstration report.\n${'Nonclinical text to verify complete lines across PDF page boundaries.\n'.repeat(95)}END OF DEMONSTRATION.` : item.report.text };
    if (missingImage) item.images = [{ id: 'pdf-test-slide', name: 'selected-slide.png', mime: 'image/png', size: 100, selected: true, persistent: true }];
    localStorage.setItem('histora:cases:v1', JSON.stringify(data));
  }, { long, missingImage });
  await page.goto('/cases/demo-242/final');
}

test('final PDF renders, navigates, zooms, downloads all pages and preserves print', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await seedFinal(page, { long: true });
  const canvas = page.locator('.pdf-page');
  await expect(canvas).toBeVisible({ timeout: 30000 });
  await expect(page.getByRole('button', { name: 'Previous page', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Next page', exact: true })).toBeEnabled();
  const firstPage = await canvas.evaluate((element) => element.toDataURL());
  await page.getByRole('button', { name: 'Next page', exact: true }).click();
  await expect(canvas).toHaveAttribute('aria-label', /Page 2 of/);
  await expect(page.locator('.pdf-viewport')).toHaveAttribute('aria-busy', 'false');
  await expect(canvas).toBeVisible();
  expect(await canvas.evaluate((element) => element.toDataURL())).not.toBe(firstPage);
  const initialWidth = await canvas.evaluate((element) => element.getBoundingClientRect().width);
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(page.locator('.pdf-zoom-value')).toHaveText('125%');
  await expect(page.locator('.pdf-viewport')).toHaveAttribute('aria-busy', 'false');
  await expect(canvas).toBeVisible();
  expect(await canvas.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(initialWidth);
  await page.getByRole('button', { name: 'Fit width', exact: true }).click();
  await expect(page.locator('.pdf-zoom-value')).toHaveText('100%');
  await expect(page.locator('.pdf-viewport')).toHaveAttribute('aria-busy', 'false');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download PDF', exact: true }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^Histora-PA-\d{4}-00242-Demo\.pdf$/);
  const bytes = await readFile(await download.path());
  expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
  const pageCount = (bytes.toString('latin1').match(/\/Type \/Page\b/g) || []).length;
  expect(pageCount).toBeGreaterThan(2);
  expect(pageCount).toBe(Number((await page.locator('.pdf-page-count').innerText()).split(' of ')[1]));
  await download.saveAs(testInfo.outputPath('final-report.pdf'));
  await page.getByRole('button', { name: 'Print / Save as PDF' }).click();
  await expect(page.frameLocator('iframe#printWindow').locator('body')).toContainText('END OF DEMONSTRATION.');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.pdf-viewer')).toBeHidden();
  await expect(page.locator('.document-report-text')).toBeVisible();
  expect(errors).toEqual([]);
});

test('PDF fits mobile, regenerates in Arabic, and cleans up when leaving the report', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await seedFinal(page);
  await expect(page.locator('.pdf-page')).toBeVisible({ timeout: 30000 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const english = await page.locator('.pdf-page').evaluate((element) => element.toDataURL());
  await page.getByRole('button', { name: 'Switch to Arabic' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('button', { name: 'تنزيل PDF' })).toBeEnabled({ timeout: 30000 });
  await expect(page.locator('.pdf-page')).toBeVisible();
  expect(await page.locator('.pdf-page').evaluate((element) => element.toDataURL())).not.toBe(english);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.reload();
  await expect(page.locator('.pdf-page')).toBeVisible({ timeout: 30000 });
  await page.goto('/cases/demo-248/review');
  await expect(page.locator('.pdf-viewer')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'تنزيل PDF' })).toHaveCount(0);
  await expect(page.locator('.pdf-capture-source')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('missing selected slide blocks PDF export and retry recovers once the image is available', async ({ page }) => {
  await seedFinal(page, { missingImage: true });
  await expect(page.locator('.pdf-message[role="alert"]')).toContainText('The image file is unavailable.');
  await expect(page.getByRole('button', { name: 'Download PDF', exact: true })).toBeDisabled();
  await page.evaluate(async () => {
    const { imageRepository } = await import('/src/services/imageRepository.js');
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 48;
    const context = canvas.getContext('2d');
    context.fillStyle = '#c020a0';
    context.fillRect(0, 0, 48, 48);
    await imageRepository.put('pdf-test-slide', await new Promise((resolve) => canvas.toBlob(resolve, 'image/png')));
  });
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(page.locator('.pdf-page')).toBeVisible({ timeout: 30000 });
  await expect(page.getByRole('button', { name: 'Download PDF', exact: true })).toBeEnabled();
  // The recovered attachment must be present in the PDF pixels, not just its HTML source.
  const hasSlideColor = await page.locator('.pdf-page').evaluate((canvas) => {
    const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index] > 170 && pixels[index + 1] < 60 && pixels[index + 2] > 130) return true;
    }
    return false;
  });
  expect(hasSlideColor).toBe(true);
});
