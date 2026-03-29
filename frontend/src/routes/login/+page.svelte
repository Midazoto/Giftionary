<script lang="ts">
    import { pb } from '$lib/pocketbase';
    import { localizeHref } from '$lib/paraglide/runtime';
    import * as m from '$lib/paraglide/messages';
    import { goto } from '$app/navigation';

    // Utilisation des runes Svelte 5 pour la réactivité
    let email = $state('');
    let password = $state('');
    let error = $state('');
    let loading = $state(false);

    async function handleLogin() {
        loading = true; // Maintenant, Svelte voit le changement et met à jour l'UI
        error = '';
        try {
            await pb.collection('users').authWithPassword(email, password);
            goto(localizeHref('/'));
        } catch (err) {
            error = m.auth_error();
        } finally {
            loading = false;
        }
    }
</script>

<div class="flex min-h-[80vh] items-center justify-center p-4">
	<div class="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-100">

		<div class="text-center">
			<h1 class="text-3xl font-bold text-gray-900">{m.login_title()}</h1>
			<p class="mt-2 text-sm text-gray-500 italic">Dashboard Access</p>
		</div>

		{#if error}
			<div class="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-pulse">
				{error}
			</div>
		{/if}

		<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }} class="space-y-6">
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">{m.email_label()}</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition-all"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">{m.password_label()}</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition-all"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
			>
				{#if loading}
					<span class="animate-spin mr-2">◌</span> Chargement...
				{:else}
					{m.login_button()}
				{/if}
			</button>
		</form>
	</div>
</div>