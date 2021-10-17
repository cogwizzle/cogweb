import { Remarkable } from 'https://cdn.jsdelivr.net/npm/remarkable@2.0.1/dist/esm/index.browser.js';

const markdown = new Remarkable();

export const md = (string) => {
  return markdown.render(string);
};
