import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ArticlePage } from '../pages/ArticlePage';
import { generateArticle, TestUsers } from '../utils/testData';

test('My Article - create, edit and delete', async ({ page }) => {
    const article = generateArticle();
    const basePage = new BasePage(page);
    await basePage.navigateTo('/');
    await basePage.clickNavSignIn();
    const loginPage = new LoginPage(page);
    await loginPage.validLogin(TestUsers.primary.email, TestUsers.primary.password);
    const articleEditorPage = await loginPage.goToArticleEditor();
    expect(await articleEditorPage.onArticleEditorPage()).toBeTruthy();

    // Create an article 
    console.log(`article title: ${article.title}`);
    
    const actualPublishMsg = await articleEditorPage.fillAndPublishArticle(article.title, article.description, article.body, article.tags);
    expect(actualPublishMsg).toContain('Published successfully');

    // Verify the article creation
    const profilePage = new ProfilePage(page);
    await profilePage.goto(TestUsers.primary.username);
    await profilePage.clickMyArticles();
    const count = await profilePage.getArticleCount();
    console.log(`article count: ${count}`);
    
    expect(count).toBeGreaterThan(0);

    // Edit the article and verify the edit to the article title is successful 
    const articlePage = new ArticlePage(page);
    await articlePage.goto(article.title.toLowerCase().replace(/\s+/g, '-'));
    await articlePage.clickEdit();
    await articleEditorPage.enterArticleInput('Article Edit Title');
    await articleEditorPage.clickPublishButton();

    await profilePage.goto(TestUsers.primary.username);
    const actualEditTitleText = await profilePage.getArticleTitleText();
    expect(actualEditTitleText).toEqual('Article Edit Title');

    // Cleanup: delete the article and verify the successful deletion of the article 
    const newSlug = 'Article Edit Title';
    await articlePage.goto(newSlug.toLowerCase().replace(/\s+/g, '-'));
    await articlePage.clickDelete();
    await profilePage.goto(TestUsers.primary.username);
    await profilePage.clickMyArticles();
    const newCount = await profilePage.getArticleCount();
    console.log(`article count: ${newCount}`);
    
    expect(newCount).toEqual(0);

});
