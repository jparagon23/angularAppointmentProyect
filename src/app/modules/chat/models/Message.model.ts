export interface Message {
  id: number;
  chatId: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string; // o Date
  isRead: boolean;
}
