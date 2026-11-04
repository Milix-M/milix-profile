import { getZennRssFeed } from './lib/zenn';

interface Env {
    ASSETS: { fetch(request: Request): Promise<Response> };
    ZENN_ARTICLES: {
        get(key: string): Promise<string | null>;
        put(key: string, value: string): Promise<void>;
    };
}

const ARTICLES_PATH = '/api/zenn/articles';
const ARTICLES_KEY = 'latest';

function unavailable() {
    return Response.json({ error: 'Articles unavailable' }, {
        status: 503,
        headers: { 'Cache-Control': 'no-store' },
    });
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        if (new URL(request.url).pathname !== ARTICLES_PATH) {
            return env.ASSETS.fetch(request);
        }
        if (request.method !== 'GET') {
            return new Response(null, { status: 405, headers: { Allow: 'GET' } });
        }

        try {
            const articles = await env.ZENN_ARTICLES.get(ARTICLES_KEY);
            if (articles === null) return unavailable();

            return new Response(articles, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Cache-Control': 'public, max-age=60',
                },
            });
        } catch (error) {
            console.error('Could not read the Zenn article list', error);
            return unavailable();
        }
    },

    async scheduled(_event: unknown, env: Env): Promise<void> {
        try {
            const articles = await getZennRssFeed();
            await env.ZENN_ARTICLES.put(ARTICLES_KEY, JSON.stringify(articles));
        } catch (error) {
            console.error('Could not update the Zenn article list', error);
            throw error;
        }
    },
};
