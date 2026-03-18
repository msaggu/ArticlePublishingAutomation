import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ArticlePage } from '../pages/ArticlePage';
import { generateArticle, TestUsers } from '../utils/testData';

test('Profile follow/unfollow - article visibility in My Feed', async ({ page }) => {
    const article = generateArticle();
    const basePage = new BasePage(page);
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);
    const articlePage = new ArticlePage(page);

    // Secondary user logs in and publishes a new article
    await basePage.navigateTo('/');
    await basePage.clickNavSignIn();
    await loginPage.validLogin(TestUsers.secondary.email, TestUsers.secondary.password);
    const articleEditorPage = await loginPage.goToArticleEditor();
    expect(await articleEditorPage.onArticleEditorPage()).toBeTruthy();

    console.log(`article title: ${article.title}`);
    const publishMsg = await articleEditorPage.fillAndPublishArticle(
        article.title,
        article.description,
        article.body,
        article.tags
    );
    expect(publishMsg).toContain('Published successfully');

    // Secondary user logs out via settings page
    await page.goto('/#/settings');
    await page.getByRole('button', { name: 'Or click here to logout.' }).click();

    // Primary user logs in and follows secondary user
    await basePage.navigateTo('/');
    await basePage.clickNavSignIn();
    await loginPage.validLogin(TestUsers.primary.email, TestUsers.primary.password);
    await profilePage.goto(TestUsers.secondary.username);
    await profilePage.clickFollow();

    // Verify article shows up in primary user's My Feed
    await basePage.clickNavHome();
    await basePage.clickMyFeed();
    await expect(page.locator('div.article-preview').filter({ hasText: article.title })).toBeVisible();

    // Primary user unfollows secondary user
    await profilePage.goto(TestUsers.secondary.username);
    await profilePage.clickUnfollow();

    // Verify article no longer shows up in primary user's My Feed
    await basePage.clickNavHome();
    await basePage.clickMyFeed();
    await expect(page.locator('div.article-preview').filter({ hasText: article.title })).not.toBeVisible();

    // Primary user - log out
    await page.goto('/#/settings');
    await page.getByRole('button', { name: 'Or click here to logout.' }).click();

    // Secondary user logs in and deletes the article
    await basePage.navigateTo('/');
    await basePage.clickNavSignIn();
    await loginPage.validLogin(TestUsers.secondary.email, TestUsers.secondary.password);

    const slug = article.title.toLowerCase().replace(/\s+/g, '-');
    await articlePage.goto(slug);
    await articlePage.clickDelete();

    // Verify the article is deleted from secondary user's profile
    await profilePage.goto(TestUsers.secondary.username);
    await profilePage.clickMyArticles();
    const articleCount = await profilePage.getArticleCount();
    console.log(`secondary user article count after deletion: ${articleCount}`);
    expect(articleCount).toEqual(0);
});
