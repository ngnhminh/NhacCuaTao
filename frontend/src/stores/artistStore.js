import { createSignal } from 'solid-js';

const [shouldReloadFollowedArtists, setshouldReloadFollowedArtists] = createSignal(false);

export { shouldReloadFollowedArtists, setshouldReloadFollowedArtists };
