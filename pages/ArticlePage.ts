import { Page, Locator } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

export class ArticlePage extends BasePage {
    private readonly articleTitle: Locator;
    private readonly articleBody: Locator;
    private readonly tagList: Locator;
    private readonly editButton: Locator;
    private readonly deleteButton: Locator;
    private readonly commentTextarea: Locator;
    private readonly postCommentButton: Locator;
    private readonly commentCards: Locator;

    constructor(page: Page) {
        super(page);
        this.articleTitle = page.locator('div.banner h1');
        this.articleBody = page.locator('div.article-content');
        this.tagList = page.locator('ul.tag-list');
        this.editButton = page.getByRole('button', { name: 'Edit Article' }).first();
        this.deleteButton = page.getByRole('button', { name: 'Delete Article' }).first();
        this.commentTextarea = page.getByPlaceholder('Write a comment...');
        this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });
        this.commentCards = page.locator("//p[@class='card-text']");
    }

    async goto(slug: string): Promise<void> {
        await this.page.goto(`/#/article/${slug}`);
    }

    async clickEdit(): Promise<void> {
        await this.editButton.click();
    }

    async clickDelete(): Promise<void> {
    await this.deleteButton.click();
    }

    async postComment(text: string): Promise<void> {
        await this.commentTextarea.fill(text);
        await this.postCommentButton.click();
        // Wait for the comment to appear in the list
        await this.commentCards.filter({ hasText: text }).waitFor({ state: 'visible', timeout: 4000 });
    }

    async deleteComment(text: string): Promise<void> {
        await this.page.locator('div.card').filter({ hasText: text }).locator('i.ion-trash-a').click();
    }

    commonCountVisiblityCheck(): Locator {
        return this.commentCards;
    }

}