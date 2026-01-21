import type { NewsArticle } from '../types/news';
import newsData from './news.json';

/**
 * JSONから読み込んだニュースデータをエクスポート
 */
export const MOCK_NEWS: NewsArticle[] = newsData as NewsArticle[];
