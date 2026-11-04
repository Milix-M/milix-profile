import Parser from 'rss-parser';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const ZENN_FEED_URL = 'https://zenn.dev/milix_m/feed?all=1';

export interface Post {
    title: string;
    date: string;
    slug: string;
}

export async function getZennRssFeed(): Promise<Post[]> {
    const response = await fetch(ZENN_FEED_URL, { signal: AbortSignal.timeout(5_000) });
    if (!response.ok) {
        throw new Error(`Zenn RSS returned HTTP ${response.status}`);
    }

    const feed = await new Parser().parseString(await response.text());
    const articles = feed.items.flatMap(({ title, pubDate, link }) => {
        const url = link ? URL.parse(link) : null;
        const publishedAt = pubDate ? Date.parse(pubDate) : NaN;
        if (!title?.trim() || url?.origin !== 'https://zenn.dev' ||
            !/^\/[^/]+\/articles\/[^/]+\/?$/.test(url.pathname) || !Number.isFinite(publishedAt)) {
            return [];
        }
        return [{ title, publishedAt, slug: url.href }];
    });
    if (articles.length === 0) {
        throw new Error('Zenn RSS contains no valid articles');
    }

    return articles.sort((a, b) => b.publishedAt - a.publishedAt).slice(0, 3).map(({ title, publishedAt, slug }) => ({
        title,
        date: dayjs(publishedAt).tz('Asia/Tokyo').format('YYYY-MM-DD'),
        slug,
    }));
}
