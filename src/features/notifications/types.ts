/** ASSUMPTION: shape of `GET notifications` (not in the API docs yet). */
export interface ApiNotification {
  id: number | string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

/** View model handed to the client list; `time` is pre-formatted on the server to avoid hydration drift. */
export interface NotificationItem {
  id: number | string;
  title: string;
  body: string;
  read: boolean;
  time: string;
}
