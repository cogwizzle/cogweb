import { toast } from '../component/toast.js';

class BlogService {
  constructor() {
    this._retrievedBlogPreviews = [];
    this._blogContent = [];
  }

  clearRetrievedBlogPreviewCache(page) {
    if (!page) {
      this._retrievedBlogPreviews = [];
      return;
    }
    this._retrievedBlogPreviews = this._retrievedBlogPreviews.filter(
      ({ page: p }) => p !== page
    );
  }

  async getIndexBlogs() {
    return this.getArchivedBlogs('index');
  }

  async getArchivedBlogs(page) {
    const cachedPage = this._retrievedBlogPreviews.find(
      ({ page: p }) => p === page
    );
    if (cachedPage !== undefined) {
      return cachedPage.entries;
    }
    try {
      const response = await fetch(`/api/blog/${page}.json`);
      if (!response.ok)
        throw new Error(`${response.status} ${response.statusText}`);
      const { entries } = await response.json();
      this._retrievedBlogPreviews = [
        ...this._retrievedBlogPreviews,
        {
          page,
          entries,
        },
      ];
      return entries;
    } catch (error) {
      toast('Something went wrong while loading blog entries.', {
        type: 'danger',
      });
    }
  }

  async getBlogContentByLocation(location) {
    const cachedBlog = this._blogContent.find(
      ({ location: l }) => l === location
    );
    if (cachedBlog !== undefined) {
      return cachedBlog.text;
    }
    try {
      const response = await fetch(`/api/blog/${location}`);
      if (response.ok) {
        const text = await response.text();
        this._blogContent = [
          ...this._blogContent,
          {
            location,
            text,
          },
        ];
        return text;
      } else {
        throw new Error(`${response.status} ${response.statusText}`);
      }
    } catch (error) {
      toast('Unable to find the blog entry.', { type: 'danger' });
      return '';
    }
  }
}

export const blogService = new BlogService();
