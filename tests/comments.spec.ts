import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { LoginPage } from '../pages/LoginPage';
import { ArticlePage } from '../pages/ArticlePage';
import { generateArticle, generateComment, TestUsers } from '../utils/testData';

test('Comment - add and delete on an article', async ({ page }) => {
    const article = generateArticle();
    const comment = generateComment();
    const basePage = new BasePage(page);
    const loginPage = new LoginPage(page);
    const articlePage = new ArticlePage(page);

    // Primary user logs in
    await basePage.navigateTo('/');
    await basePage.clickNavSignIn();
    await loginPage.validLogin(TestUsers.primary.email, TestUsers.primary.password);

    // Primary user creates an article
    const articleEditorPage = await loginPage.goToArticleEditor();
    expect(await articleEditorPage.onArticleEditorPage()).toBeTruthy();

    const publishMsg = await articleEditorPage.fillAndPublishArticle(
        article.title,
        article.description,
        article.body,
        article.tags
    );
    expect(publishMsg).toContain('Published successfully');

    // Primary user adds a comment and verifies it is added
    const slug = article.title.toLowerCase().replace(/\s+/g, '-');
    await articlePage.goto(slug);
    await articlePage.postComment(comment);

    await expect(await articlePage.commonCountVisiblityCheck()).toBeVisible({timeout: 3000});

    // Primary user deletes the comment and verifies it is deleted
    await articlePage.deleteComment(comment);
    await expect(await articlePage.commonCountVisiblityCheck()).not.toBeVisible({timeout: 3000});

    // Cleanup: delete the article
    await articlePage.goto(slug);
    await articlePage.clickDelete();
});
