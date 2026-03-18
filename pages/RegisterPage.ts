import {Page, Locator } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

export class RegisterPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signUpButton: Locator;
    private readonly regSuccessMessage: Locator;
    private readonly signUpHeader: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.signUpButton = page.getByRole('button', { name: 'Sign up' });
        this.regSuccessMessage = page.getByText('Registration successful. Redirecting to login page...', { exact: true });
        this.signUpHeader = page.locator(`h1:has-text("Sign up")`);
    }

    async isSignUpHeaderVisible(): Promise<boolean> {
        return await this.signUpHeader.isVisible();
    }
    
    async enterUsername(username: string): Promise<void> {
        await this.usernameInput.fill(username);
    }

    async enterEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    async enterPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    async register(username: string, email: string, password: string): Promise<string | null> {
        await this.enterUsername(username);
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.signUpButton.click();
        const regSuccessMsg = await this.regSuccessMessage.textContent({ timeout: 4000 });
        console.log(`registration message: ${regSuccessMsg}`);
        return regSuccessMsg;
    }

}