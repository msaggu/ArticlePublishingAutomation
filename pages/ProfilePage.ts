import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
    private readonly username: Locator;
    private readonly followButton: Locator;
    private readonly unfollowButton: Locator;
    private readonly editSettingsButton: Locator;
    private readonly myArticlesTab: Locator;
    private readonly favoritedArticlesTab: Locator;
    private readonly articlePreview: Locator;

    constructor(page: Page) {
        super(page);
        this.username = page.locator('div.user-info h4');
        this.followButton = page.locator(`button:has-text("Follow")`);
        this.unfollowButton = page.locator(`button:has-text("Unfollow")`);
        this.editSettingsButton = page.getByRole('button', { name: 'Edit Profile Settings' });
        this.myArticlesTab = page.locator(`(//div[@class='articles-toggle']//a)[1]`);
        this.favoritedArticlesTab = page.locator(`(//div[@class='articles-toggle']//a)[2]`);
        this.articlePreview = page.locator("(//div[@class='article-preview']//h1)[1]");
    }

    async goto(username: string): Promise<void> {
        await this.page.goto(`/#/profile/${username}`);
    }

    async clickFollow(): Promise<void> {
        await this.followButton.click();
    }

    async clickUnfollow(): Promise<void> {
        await this.unfollowButton.click();
    }

    async clickMyArticles(): Promise<void> {
        await this.myArticlesTab.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getArticleCount(): Promise<number> {
        return this.articlePreview.count();
    }

    async getArticleTitleText(): Promise<string | null> {
        return await this.articlePreview.textContent();
    }

}