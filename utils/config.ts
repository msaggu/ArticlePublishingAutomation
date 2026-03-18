import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

type User = {
  email: string;
  password: string;
  username: string;
};

type Config = {
  baseUrl: string;
  users: {
    primary: User;
    secondary: User;
  };
};

// Read YAML file
const filePath = path.resolve(__dirname, '../config.yaml');
const fileContents = fs.readFileSync(filePath, 'utf8');

// Parse YAML → JS object
export const config = yaml.load(fileContents) as Config;