<script lang="ts">
    import { page } from '$app/state';
    import { getLocale, locales, localizeHref } from '$lib/paraglide/runtime';
    import { pb, currentUser } from '$lib/pocketbase';
    import { goto } from '$app/navigation';
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import * as m from '$lib/paraglide/messages';

    let { children } = $props();

    let isLangMenuOpen = $state(false);
    let langMenuEl: HTMLDivElement | null = null;

    const localeLabels: Record<string, string> = {
        fr: 'Francais',
        en: 'English'
    };

    function getLocaleLabel(locale: string) {
        return localeLabels[locale] ?? locale.toUpperCase();
    }

    function getLocaleFlag(locale: string) {
        return `/flags/${locale}.svg`;
    }
    
    function onFlagError(event: Event) {
        const img = event.currentTarget as HTMLImageElement | null;
        if (!img) return;
        if (img.dataset.fallbackApplied === '1') return;
        img.dataset.fallbackApplied = '1';
        img.src = '/flags/default.svg';
    }

    function closeLanguageMenu() {
        isLangMenuOpen = false;
    }

    function toggleLanguageMenu() {
        isLangMenuOpen = !isLangMenuOpen;
    }

    function onWindowClick(event: MouseEvent) {
        if (!isLangMenuOpen || !langMenuEl) return;
        const target = event.target;
        if (target instanceof Node && !langMenuEl.contains(target)) {
            closeLanguageMenu();
        }
    }

    function onWindowKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            closeLanguageMenu();
        }
    }

    function logout() {
        pb.authStore.clear();
        goto(localizeHref('/login'));
    }
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<svelte:window onclick={onWindowClick} onkeydown={onWindowKeydown} />

<header class="flex items-center justify-between p-4 bg-white border-b shadow-sm">
    <nav class="flex gap-4">
        <a href={localizeHref('/')} class="font-bold text-blue-600">Home</a>
    </nav>

    <div class="flex items-center gap-6">
        <div class="relative" bind:this={langMenuEl}>
            <button
                type="button"
                onclick={toggleLanguageMenu}
                class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-gray-50"
                aria-haspopup="menu"
                aria-expanded={isLangMenuOpen}
            >
                <img
                    src={getLocaleFlag(getLocale())}
                    alt=""
                    onerror={onFlagError}
                    class="h-3.5 w-5 rounded-sm border border-gray-200 object-cover"
                />
                <span class="uppercase">{getLocale()}</span>
                <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class={'h-4 w-4 transition-transform ' + (isLangMenuOpen ? 'rotate-180' : '')}
                >
                    <path
                        fill-rule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.155l3.71-3.925a.75.75 0 111.08 1.04l-4.24 4.485a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clip-rule="evenodd"
                    />
                </svg>
            </button>

            {#if isLangMenuOpen}
                <div
                    class="absolute right-0 z-30 mt-2 w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
                    role="menu"
                >
                    {#each locales as locale}
                        <a
                            data-sveltekit-reload
                            href={localizeHref(page.url.pathname + page.url.search, { locale })}
                            onclick={closeLanguageMenu}
                            class={'flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-100 ' + (locale === getLocale() ? 'bg-gray-100 font-semibold text-blue-600' : 'text-gray-700')}
                            role="menuitem"
                        >
                            <span class="flex items-center gap-2">
                                <img
                                    src={getLocaleFlag(locale)}
                                    alt=""
                                    onerror={onFlagError}
                                    class="h-3.5 w-5 rounded-sm border border-gray-200 object-cover"
                                />
                                <span>{getLocaleLabel(locale)}</span>
                            </span>
                            <span class="text-xs uppercase">{locale}</span>
                        </a>
                    {/each}
                </div>
            {/if}
        </div>

        {#if $currentUser}
            <div class="flex items-center gap-3">
                <span class="text-sm text-gray-600">{$currentUser.email}</span>
                <button
                    onclick={logout}
                    class="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-md hover:bg-red-100 transition-colors"
                >
                    Deconnexion
                </button>
            </div>
        {:else}
            <a href={localizeHref('/login')} class="text-sm font-medium hover:text-blue-600">
                Connexion
            </a>
        {/if}
    </div>
</header>

<main class="p-6">
    {@render children()}
</main>

<div style="display:none">
    {#each locales as locale}
        <a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
    {/each}
</div>