import { test, expect } from '@playwright/test';

test.describe('<mr-slider>', () => {
  test('has default value of 50', async ({ page }) => {
    await page.goto('/');
    const slider = page.locator('mr-slider');
    await expect(slider).toHaveAttribute('value', '50');
  });

  test('updates value on input', async ({ page }) => {
    await page.goto('/');
    
    // Get the input inside the shadow DOM
    const input = page.locator('mr-slider').locator('input[type="range"]');
    
    // Change the value
    await input.fill('75');
    
    // Check the value was updated
    await expect(input).toHaveValue('75');
    
    // Check the custom element's value property
    const value = await page.evaluate((): number => {
      interface MrSliderElement extends HTMLElement {
        value: number;
      }
      const slider = document.querySelector('mr-slider') as MrSliderElement | null;
      return slider?.value ?? 0;
    });
    
    expect(value).toBe(75);
  });
});