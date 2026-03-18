import { Page, Locator } from '@playwright/test';

/**
 * BasePage contains common helpers shared across all page objects.
 * Every page object extends this class.
 */
export class BasePage {
    readonly page: Page; 

    // ---- Locators ----
    readonly navHome: Locator; 
    readonly navSignIn: Locator;
    readonly navSignUp: Locator;
    readonly navNewArticle: Locator;
    readonly navSettings: Locator;
    readonly navMyProfile: Locator; 
    readonly MyFeed: Locator;

    constructor(page: Page) {
        this.page = page;
        this.navHome = this.page.getByRole('link', { name: 'Home' });
        this.navSignIn = this.page.getByRole('link', { name: 'Sign in' });
        this.navSignUp = this.page.getByRole('link', { name: 'Sign up' });
        this.navNewArticle = this.page.getByRole('link', { name: 'New Article' });
        this.navSettings = this.page.getByRole('link', { name: 'Settings' });
        this.navMyProfile = this.page.locator('.user-pic');
        this.MyFeed = this.page.getByText('My Feed', { exact: true });
    }

    // ---- Page Methods ----
    async navigateTo(path: string): Promise<void> {
        await this.page.goto(path);
    }

    async clickNavHome() {
        await this.navHome.click();
    }

    async clickNavSignIn() {
        await this.navSignIn.click();
    }

    async clickNavSignUp() {
        await this.navSignUp.click();
    }

    async clickNavNewArticle() {
        await this.navNewArticle.click();
    }

    async clickNavSettings() {
        await this.navSettings.click();
    }

    async clickMyFeed() {
        await this.MyFeed.click();
    }
    
}