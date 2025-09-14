// Utility to trigger SSE notifications from anywhere
import { sendSseNotification } from "../routes/notificationSseRoutes";

export function triggerTestNotification() {
  sendSseNotification({
    text: "This is a test notification (SSE)",
    time: new Date().toLocaleTimeString(),
    read: false,
  });
}
