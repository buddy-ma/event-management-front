import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Declare the Echo instance on the window object
declare global {
  interface Window {
    Echo: Echo;
    Pusher: typeof Pusher;
  }
}

// Make sure Pusher is available globally
window.Pusher = Pusher;

// Validate required environment variables
const PUSHER_APP_KEY = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
const PUSHER_APP_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;

if (!PUSHER_APP_KEY || !PUSHER_APP_CLUSTER) {
  throw new Error(
    "Missing Pusher configuration. Please ensure NEXT_PUBLIC_PUSHER_APP_KEY and NEXT_PUBLIC_PUSHER_APP_CLUSTER are set in your environment variables."
  );
}

// Create Echo instance with configuration
const echo = new Echo({
  broadcaster: "pusher",
  key: PUSHER_APP_KEY,
  cluster: PUSHER_APP_CLUSTER,
  forceTLS: true,
  // Additional optional configuration
  encrypted: true,
  authorizer: (channel: any, options: any) => {
    return {
      authorize: async (socketId: string, callback: Function) => {
        try {
          const response = await fetch("/api/broadcasting/auth", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            }),
          });

          const data = await response.json();
          callback(null, data);
        } catch (error) {
          callback(error);
        }
      },
    };
  },
});

// Helper functions for common real-time operations
export const subscribeToEvent = (
  eventId: number,
  callback: (data: any) => void
) => {
  return echo
    .private(`event.${eventId}`)
    .listen(".event.updated", callback)
    .listen(".event.deleted", callback)
    .listen(".participant.joined", callback)
    .listen(".participant.left", callback);
};

export const subscribeToUserEvents = (
  userId: number,
  callback: (data: any) => void
) => {
  return echo
    .private(`user.${userId}`)
    .listen(".event.invitation", callback)
    .listen(".event.reminder", callback);
};

// Export the echo instance as default
export default echo;
