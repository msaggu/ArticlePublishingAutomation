import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { BasePage } from '../pages/BasePage';
import { generateUser } from '../utils/testData';

/** Registration tests — always start unauthenticated */
test.use({ storageState: { cookies: [], origins: [] } });

test('register a new user', async ({ page }) => {
    const user = generateUser();
    const basePage = new BasePage(page);
    await basePage.navigateTo('/');
    await basePage.clickNavSignUp();
    const registerPage = new RegisterPage(page);
    expect(await registerPage.isSignUpHeaderVisible()).toBeTruthy();
    const successMessage = await registerPage.register(user.username, user.email, user.password);
    expect(successMessage).toContain('Registration successful');
});