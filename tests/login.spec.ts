import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { LoginPage } from '../pages/LoginPage';
import { config } from '../utils/config';
import { TestUsers, InvalidCredentials } from '../utils/testData';

test('log in with valid credentials', {tag:['@smoke']}, async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.navigateTo('/');
    await basePage.clickNavSignIn();
    const loginPage = new LoginPage(page);
    const actualText = await loginPage.validLogin(TestUsers.primary.email, TestUsers.primary.password);
    console.log(actualText);
    expect(actualText).toContain('New Article');
});

test('log in with in-valid credentials', async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.navigateTo('/');
    await basePage.clickNavSignIn();
    const loginPage = new LoginPage(page);
    const actualErrMsg = await loginPage.invalidLogin(
        InvalidCredentials.wrongPassword.email,
        InvalidCredentials.wrongPassword.password
    );
    expect(actualErrMsg).toContain('Invalid email or password');
});
