import { CreateLazyLoader } from './lazy-loader-element.js';

export const LazyBlogEntryPage = CreateLazyLoader({
  componentName: 'BlogEntryPage',
  path: './blog-entry-page.js',
  tagName: 'cw-blog-entry-page',
});
