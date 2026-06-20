import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page.js';
import { SearchResultsPage } from '../../pages/searchResults.page.js';
import { PropertyPage } from '../../pages/property.page.js';

test.describe('Booking.com Booking Flow', () => {

  test('Search and verify property overview for Munnar', async ({ page }) => {
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    let propertyPage;

    await test.step('Navigate to Booking.com', async () => {
      await homePage.goto();
    });

    await test.step('Dismiss sign-in popup if present', async () => {
      await homePage.dismissSignInPopup();
    });

    await test.step('Select destination Munnar', async () => {
      await homePage.selectDestination('Munnar');
    });

    await test.step('Select random check-in and check-out dates', async () => {
      const { checkIn, checkOut } = homePage.generateRandomDates();
      await homePage.selectDates(checkIn, checkOut);
    });

    await test.step('Configure occupancy - child age 8, 2 rooms', async () => {
      await homePage.configureOccupancy('8', 2);
    });

    await test.step('Click Search', async () => {
      await homePage.clickSearch();
    });

    let propertyPageRef;
    await test.step('Click first property in results', async () => {
      propertyPageRef = await searchResultsPage.clickFirstResult();
    });

    await test.step('Verify Overview is visible on property page', async () => {
      propertyPage = new PropertyPage(propertyPageRef);
      const isVisible = await propertyPage.isOverviewVisible();
      expect(isVisible).toBeTruthy();
    });
  });

});
