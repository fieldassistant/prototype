
import { registerRoute } from 'workbox-routing/registerRoute';
import { Plugin as ExpirationPlugin } from 'workbox-expiration/Plugin';
import { StaleWhileRevalidate } from 'workbox-strategies/StaleWhileRevalidate';
import { CacheFirst } from 'workbox-strategies/CacheFirst';
import { setDefaultHandler } from 'workbox-routing/setDefaultHandler';
import { setCatchHandler } from 'workbox-routing/setCatchHandler';

const ONE_YEAR = 365 * 24 * 60 * 60;

// Home
registerRoute(/\//, new StaleWhileRevalidate());

// Cache Assets
registerRoute(
    /\.(?:js|css|html)$/,
    new StaleWhileRevalidate({
        plugins: [
            new ExpirationPlugin({
              maxEntries: 10,
              maxAgeSeconds: ONE_YEAR,
            }),
          ],
    })
);

// Cache images
registerRoute(
    /\.(?:png|ico|svg)$/,
    new CacheFirst({
        cacheName: 'images',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 10,
                maxAgeSeconds: ONE_YEAR,
            }),
        ],
    }),
);

// Push-state behaviour
setDefaultHandler(async (context) => (
    context.url.pathname === '/migrate.php'
        ? await fetch(context.url)
        : (await caches.match("/") || Response.error())
));

setCatchHandler(async () => (
    await caches.match("/") || Response.error()
))

