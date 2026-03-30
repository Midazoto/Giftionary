<script lang="ts">
    import { localizeHref } from '$lib/paraglide/runtime';
    import { pb, currentUser } from '$lib/pocketbase';
    import { goto } from '$app/navigation';
    import LanguageSelector from '$lib/components/language_selector.svelte';
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import * as m from '$lib/paraglide/messages';

    let { children } = $props();

    function logout() {
        pb.authStore.clear();
        goto(localizeHref('/login'));
    }
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <title>Giftionary</title>
</svelte:head>

<header class="flex items-center justify-between p-4 bg-white border-b shadow-sm">
    <nav class="flex gap-4">
        <a href={localizeHref('/')} class="font-bold text-blue-600">{m.home_button()}</a>
    </nav>

    <div class="flex items-center gap-6">
        <LanguageSelector />

        {#if $currentUser}
            <div class="flex items-center gap-3">
                <span class="text-sm text-gray-600">{$currentUser.email}</span>
                <button
                    onclick={logout}
                    class="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-md hover:bg-red-100 transition-colors"
                >
                    {m.logout_button()}
                </button>
            </div>
        {:else}
            <a href={localizeHref('/login')} class="text-sm font-medium hover:text-blue-600">
                {m.login_button_nav()}
            </a>
        {/if}
    </div>
</header>

<main class="p-6">
    {@render children()}
</main>

