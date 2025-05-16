import { createSignal } from 'solid-js';

const [transferNotification, setTransferNotification] = createSignal(null);
const [transferNotificationForArtist, setTransferNotificationForArtist] = createSignal(null);

export { transferNotification, setTransferNotification, transferNotificationForArtist, setTransferNotificationForArtist };