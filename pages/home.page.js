import { BasePage } from './base.page.js';

export class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.dismissSignInButton = page.getByRole('button', { name: 'Dismiss sign-in info.' });
    this.destinationInput = page.getByRole('combobox', { name: 'Where are you going?' });
    this.datePickerButton = page.getByTestId('searchbox-dates-container');
    this.occupancyConfigButton = page.getByTestId('occupancy-config');
    this.childAgeSelect = page.getByTestId('kids-ages-select').locator('select');
    this.doneButton = page.getByRole('button', { name: 'Done' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
  }

  async goto() {
    await this.navigate('/');
  }

  async dismissSignInPopup() {
    try {
      await this.dismissSignInButton.click({ timeout: 5000 });
    } catch {
      // Popup may not appear each time
    }
  }

  async selectDestination(destination) {
    await this.destinationInput.click();
    await this.destinationInput.fill(destination);
    const suggestion = this.page.getByRole('option').filter({ hasText: destination });
    await suggestion.first().waitFor({ state: 'visible', timeout: 5000 });
    await suggestion.first().click();
  }

  generateRandomDates() {
    const today = new Date();
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() + Math.floor(Math.random() * 30) + 30);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + Math.floor(Math.random() * 5) + 3);
    return { checkIn, checkOut };
  }

  async selectDates(checkIn, checkOut) {
    const calendar = this.page.getByTestId('searchbox-datepicker-calendar');
    const isCalendarOpen = await calendar.isVisible().catch(() => false);
    if (!isCalendarOpen) {
      await this.datePickerButton.click();
      await this.page.waitForTimeout(1000);
    }

    const nextBtn = this.page.locator('button[aria-label="Next month"]');

    const clickDate = async (date) => {
      const ds = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const loc = this.page.locator(`[data-date="${ds}"]`);
      for (let i = 0; i < 12; i++) {
        if (await loc.isVisible().catch(() => false)) break;
        await nextBtn.click();
        await this.page.waitForTimeout(400);
      }
      await loc.click();
    };

    await clickDate(checkIn);
    await this.page.waitForTimeout(800);
    const stillOpen = await calendar.isVisible().catch(() => false);
    if (!stillOpen) {
      await this.datePickerButton.click();
      await this.page.waitForTimeout(800);
    }
    await clickDate(checkOut);
    await this.page.waitForTimeout(500);
  }

  async configureOccupancy(childAge = '8', rooms = 2) {
    const occPopup = this.page.getByTestId('occupancy-popup');
    const isOpen = await occPopup.isVisible().catch(() => false);
    if (!isOpen) {
      await this.occupancyConfigButton.click({ force: true });
      await this.page.waitForTimeout(1000);
    }

    const sectionByLabel = (text) =>
      this.page.locator('[data-testid="occupancy-popup"] .e484bb5b7a', { hasText: text });

    const childrenPlus = sectionByLabel('Children').locator('button').last();
    await childrenPlus.click();
    await this.page.waitForTimeout(500);
    await this.childAgeSelect.waitFor({ state: 'visible', timeout: 5000 });
    await this.childAgeSelect.selectOption(`${childAge} years old`);

    if (rooms > 1) {
      const roomsPlus = sectionByLabel('Rooms').locator('button').last();
      for (let i = 1; i < rooms; i++) {
        await roomsPlus.click();
        await this.page.waitForTimeout(200);
      }
    }

    await this.doneButton.click();
  }

  async clickSearch() {
    await this.searchButton.click();
    await this.page.waitForURL('**/searchresults**', { timeout: 20000 });
  }
}
