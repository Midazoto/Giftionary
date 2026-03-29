import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
import { env } from '$env/dynamic/public';

const pbUrl = env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(pbUrl);

// On utilise .record au lieu de .model
export const currentUser = writable(pb.authStore.record);

// On écoute les changements d'auth
pb.authStore.onChange((token, record) => {
    console.log('Changement d\'auth détecté');
    currentUser.set(record);
});