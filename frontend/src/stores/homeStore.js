import { createSignal } from 'solid-js';

const [shouldReloadHistory, setShouldReloadHistory] = createSignal(false);

export { shouldReloadHistory, setShouldReloadHistory };
