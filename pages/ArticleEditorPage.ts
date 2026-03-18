import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

export class ArticleEditorPage extends BasePage {
    private readonly articleEditorHeader: Locator;
    private readonly titleInput: Locator;
    private readonly descriptionInput: Locator;
    private readonly bodyTextarea: Locator;
    private readonly tagInput: Locator;
    private readonly publishButton: Locator;
    private readonly publishMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.articleEditorHeader = page.getByRole('heading', { name: 'Article editor' });
        this.titleInput = page.locator("//input[@formcontrolname='title']");
        this.descriptionInput = page.locator("//input[@formcontrolname='description']");
        this.bodyTextarea = page.locator("//textarea[@formcontrolname='body']");
        this.tagInput = page.getByRole('textbox', { name: 'Enter tags' });
        this.publishButton = page.getByRole('button', { name: 'Publish Article' });
        this.publishMessage = page.getByText('Published successfully!', { exact: true });
    }

    async onArticleEditorPage(): Promise<boolean> {
        return await this.articleEditorHeader.isVisible({ timeout: 3000 });
    }

    async enterArticleInput(text: string):Promise<void> {
        await this.titleInput.clear();
        await this.titleInput.fill(text);
    }

    async clickPublishButton() {
        await this.publishButton.click();
    }

    /**
     * Fill in and publish a new article.
     * Tags are optional — pass an array of tag strings.
    */
    async fillAndPublishArticle (
        title: string,
        description: string,
        body: string,
        tags: string[] = [],
    ): Promise<string | null> {
        await this.titleInput.fill(title);
        await this.descriptionInput.fill(description);
        await this.bodyTextarea.fill(body);

        for (const tag of tags) {
            await this.addTag(tag);
        }

        await this.publishButton.click();
        const message = await this.publishMessage.textContent();
        console.log(`article publish message: ${message}`);
        return message;
    }

    /** Type a tag name and press Enter to add it */
    async addTag(tagName: string): Promise<void> {
    await this.tagInput.fill(tagName);
    await this.tagInput.press('Enter');
    await expect(this.page.getByText(`${tagName}`, { exact: true })).toBeVisible();
  }
}