import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import {
    baseLocale,
    cookieName,
    getTextDirection,
    isLocale,
    localizeUrl
} from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

const redirectFromCookieIfNoPrefix: Handle = async ({ event, resolve }) => {
    const firstSegment = event.url.pathname.split('/').filter(Boolean)[0];
    const hasLocalePrefix = typeof firstSegment === 'string' && isLocale(firstSegment);

    if (!hasLocalePrefix) {
        const cookieLocale = event.cookies.get(cookieName);
        const locale =
            typeof cookieLocale === 'string' && isLocale(cookieLocale) ? cookieLocale : baseLocale;

        const target = localizeUrl(event.url, { locale });

        if (target.href !== event.url.href) {
            throw redirect(307, target.href);
        }
    }

    return resolve(event);
};

const handleParaglide: Handle = ({ event, resolve }) =>
    paraglideMiddleware(event.request, ({ request, locale }) => {
        event.request = request;
        return resolve(event, {
            transformPageChunk: ({ html }) =>
                html.replace('%lang%', locale).replace('%dir%', getTextDirection(locale))
        });
    });

export const handle: Handle = sequence(redirectFromCookieIfNoPrefix, handleParaglide);