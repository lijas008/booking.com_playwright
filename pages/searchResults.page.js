import { BasePage } from './base.page.js';

export class SearchResultsPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstPropertyLink = page.locator('[data-testid="property-card"] a').first();
  }

  async clickFirstResult() {
    await this.firstPropertyLink.waitFor({ state: 'visible', timeout: 15000 });
    const [newPage] = await Promise.all([
      this.page.waitForEvent('popup', { timeout: 10000 }).catch(() => null),
      this.firstPropertyLink.click()
    ]);
    if (newPage) {
      await newPage.waitForLoadState('domcontentloaded');
      return newPage;
    }
    await this.page.waitForURL('**/hotel/**', { timeout: 20000 });
    return this.page;
  }
}
