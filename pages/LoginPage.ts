import { Page, Locator } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { ArticleEditorPage } from '../pages/ArticleEditorPage';

export class LoginPage extends BasePage {
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly SignInButton: Locator;
    private readonly invalidLoginErrMsg: Locator;

    constructor(page: Page) {
        super(page);
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.SignInButton = page.getByRole('button', { name: 'Sign in' });
        this.invalidLoginErrMsg = page.getByText('Invalid email or password', { exact: true });
    }

    async enterEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    async enterPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    async validLogin(email: string, password: string): Promise<string | null>
 {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.SignInButton.click();
        return await this.navNewArticle.textContent();
    }

    async invalidLogin(email: string, password: string): Promise<string | null> {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.SignInButton.click();
        const err = await this.invalidLoginErrMsg.textContent();
        console.log(`error message for invalid login: ${err}`);
        return err;
    }

    async goToArticleEditor(): Promise<ArticleEditorPage> {
        await this.navNewArticle.click()
        return new ArticleEditorPage(this.page);
    }

}