import { BasePage } from './base.page.js';

export class PropertyPage extends BasePage {
  constructor(page) {
    super(page);
    this.overviewHeading = page.getByRole('heading', { name: /overview/i }).first();
    this.overviewText = page.getByText(/overview/i).first();
  }

  async isOverviewVisible() {
    await this.waitForPageLoad();
    try {
      await this.overviewHeading.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      try {
        await this.overviewText.waitFor({ state: 'visible', timeout: 5000 });
        return true;
      } catch {
        return false;
      }
    }
  }

  async clickReserve() {
    await this.page.getByRole('button', { name: /reserve/i }).first().click();
    await this.page.waitForTimeout(3000);
  }
}
