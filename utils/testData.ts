import { config } from './config';

/** Generates a unique random id */
function getRandomID(): string {
    let randomID = Math.random().toString(36).substring(2,9);
    return randomID;
}

export const TestUsers = {
  /** Primary test user — configured in config.yaml */
  primary: config.users.primary,

  /** Secondary test user — used for follow/unfollow and multi-user scenarios */
  secondary: config.users.secondary,
};

/** Generates unique article data for each test run to avoid conflicts */
export const generateArticle = () => ({ 
        title:       `Test Article ${getRandomID()}`,
        description: 'This article is created by automated tests.',
        body:        'The test body of this article is written by Playwright.',
        tags:        ['playwright', 'automation'],
});

/** Generates unique user registration data */
export const generateUser = () => {
  let id = getRandomID();
  return {
    username: `autouser${id}`,
    email:    `autouser${id}@example.com`,
    password: 'Password123!',
  };
};

/** Invalid credential test data */
export const InvalidCredentials = {
  wrongPassword: {
    email:    TestUsers.primary.email,
    password: 'WrongPassword999!',
  },
} as const;

/** Generates unique comment data */
export const generateComment = (): string =>
  `Automated comment ${getRandomID()} — created by Playwright`;

