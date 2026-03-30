<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { getLocale } from '$lib/paraglide/runtime';
</script>

<h1>{m.home_title()}</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<p>Langue actuelle : {getLocale()}</p>