<script lang="ts">
    import { getLocale, locales, setLocale } from '$lib/paraglide/runtime';
    import LanguageButton from '$lib/components/language_button.svelte';

    let isLangMenuOpen = $state(false);
    let langMenuEl: HTMLDivElement | null = null;

    type Locale = (typeof locales)[number];

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

    function changeLanguage(locale: Locale) {
        closeLanguageMenu();
        if (locale === getLocale()) return;
        setLocale(locale);
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
</script>

<svelte:window onclick={onWindowClick} onkeydown={onWindowKeydown} />

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
            class="absolute right-0 z-30 mt-2 flex w-max min-w-max flex-col rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
            role="menu"
        >
            {#each locales as locale}
                <LanguageButton
                    locale={locale}
                    label={getLocaleLabel(locale)}
                    active={locale === getLocale()}
                    onSelect={() => changeLanguage(locale)}
                />
            {/each}
        </div>
    {/if}
</div>
