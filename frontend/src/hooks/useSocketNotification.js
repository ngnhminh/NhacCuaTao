import { createSignal, onCleanup } from "solid-js";
import { setTransferNotification } from "../stores/notificationStore";
import { setTransferNotificationForArtist } from "../stores/notificationStore";

let socket = null;
let pendingSubscriptions = [];

const useSocketNotification = () => {
  const [subscribedChannels, setSubscribedChannels] = createSignal([]);


  const connectSocket = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("🔌 Socket already connected.");
      return;
    }

    if (socket && socket.readyState === WebSocket.CLOSED) {
      console.log("🔄 Socket was closed, reconnecting...");
      socket = null;
    }

    socket = new WebSocket(`ws://localhost:8000/ws/notifications/`);

    socket.onopen = () => {
      console.log("✅ Socket connected");

      // Gửi các subscribe đang chờ
      pendingSubscriptions.forEach((artistId) => {
        socket.send(JSON.stringify({ type: "subscribe", channel: `artist_${artistId}` }));
        setSubscribedChannels((prev) => [...prev, artistId]);
      });
      pendingSubscriptions = [];
    };

    socket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log("📨 Message received:", data);

        if (data.message.type === "artist_notification") {
          setTransferNotificationForArtist(data)
        } else if (data.message.type === "user_notification") {
          setTransferNotification(data);
        }
      } catch (err) {
        console.error("❌ Error in onmessage:", err);
      }
    };


    socket.onclose = () => {
      console.log("❌ Socket closed");
    };

    socket.onerror = (err) => {
      console.error("⚠️ Socket error:", err);
    };
  };

  const followArtist = (artistId) => {
    if (subscribedChannels().includes(artistId)) return;

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "subscribe", channel: `artist_${artistId}` }));
      setSubscribedChannels((prev) => [...prev, artistId]);
    } else {
      if (!pendingSubscriptions.includes(artistId)) {
        pendingSubscriptions.push(artistId);
      }
    }
  };

  const unfollowArtist = (artistId) => {
    if (socket && socket.readyState === WebSocket.OPEN && subscribedChannels().includes(artistId)) {
      socket.send(JSON.stringify({ type: "unsubscribe", channel: `artist_${artistId}` }));
      setSubscribedChannels((prev) => prev.filter((id) => id !== artistId));
    } else {
      // Nếu socket chưa mở thì xóa luôn khỏi pending (nếu có)
      pendingSubscriptions = pendingSubscriptions.filter((id) => id !== artistId);
    }
  };

  const closeSocket = () => {
    if (socket) {
      socket.close();
      socket = null;
    }
  };

  onCleanup(() => {
    closeSocket();
  });

  return {
    connectSocket,
    followArtist,
    unfollowArtist,
    closeSocket,
  };
};

export default useSocketNotification;
