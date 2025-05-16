import { createSignal } from 'solid-js';

const [shouldReloadPlaylists, setShouldReloadPlaylists] = createSignal(false);

export { shouldReloadPlaylists, setShouldReloadPlaylists };
