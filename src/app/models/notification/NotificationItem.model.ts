export interface NotificationItem {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  actionUrl: string;
  channel: string;
  createdAt: string;
  status: string;
}
