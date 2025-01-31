const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export class NewsService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchNews(query: string) {
    try {
      const response = await fetch(
        `${NEWS_API_BASE_URL}/everything?` +
        `q=${encodeURIComponent(query)}&` +
        `sortBy=relevancy&` +
        `language=en&` +
        `pageSize=10`,
        {
          headers: {
            'X-Api-Key': this.apiKey
          }
        }
      );

      if (!response.ok) {
        throw new Error('News API request failed');
      }

      const data = await response.json();
      return data.articles;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }

  async getTopNews() {
    try {
      const response = await fetch(
        `${NEWS_API_BASE_URL}/top-headlines?` +
        `country=us&` +
        `pageSize=10`,
        {
          headers: {
            'X-Api-Key': this.apiKey
          }
        }
      );

      if (!response.ok) {
        throw new Error('News API request failed');
      }

      const data = await response.json();
      return data.articles;
    } catch (error) {
      console.error('Error fetching top news:', error);
      throw error;
    }
  }
} 