<script lang="ts">
    let { locale, label, active = false, onSelect }: { locale: string; label: string; active?: boolean; onSelect?: () => void } = $props();

    function getLocaleFlag(inputLocale: string) {
        return `/flags/${inputLocale}.svg`;
    }

    function onFlagError(event: Event) {
        const img = event.currentTarget as HTMLImageElement | null;
        if (!img) return;
        if (img.dataset.fallbackApplied === '1') return;
        img.dataset.fallbackApplied = '1';
        img.src = '/flags/default.svg';
    }
</script>

<button
    type="button"
    onclick={() => onSelect?.()}
    class={'flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 ' + (active ? 'bg-gray-100 font-semibold text-blue-600' : 'text-gray-700')}
    role="menuitem"
>
    <span class="flex items-center gap-2">
        <img
            src={getLocaleFlag(locale)}
            alt=""
            onerror={onFlagError}
            class="h-3.5 w-5 rounded-sm border border-gray-200 object-cover"
        />
        <span>{label}</span>
    </span>
</button>
