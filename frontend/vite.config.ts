import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import type { Locale } from './src/lib/paraglide/runtime';

type InlangSettings = {
    locales: string[];
};

const settings = JSON.parse(
    readFileSync(new URL('./project.inlang/settings.json', import.meta.url), 'utf-8')
) as InlangSettings;

type LocalizedTuple = [Locale, string];

// Pattern explicite pour la racine, évite les boucles de redirection
const localizedRoot: LocalizedTuple[] = settings.locales.map((locale) => [
    locale as Locale,
    `/${locale}`
]);

// Pattern générique pour toutes les autres routes
const localizedWildcard: LocalizedTuple[] = settings.locales.map((locale) => [
    locale as Locale,
    `/${locale}/:path(.*)?`
]);

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit(),
        paraglideVitePlugin({
            project: './project.inlang',
            outdir: './src/lib/paraglide',
            strategy: ['url', 'cookie', 'baseLocale'],
            urlPatterns: [
                {
                    pattern: '/',
                    localized: localizedRoot
                },
                {
                    pattern: '/:path(.*)?',
                    localized: localizedWildcard
                }
            ]
        })
    ]
});