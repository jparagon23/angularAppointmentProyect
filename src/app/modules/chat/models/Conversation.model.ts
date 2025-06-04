export interface Conversation {
  id: number;
  participantName: string;
  participantId: number;
  lastMessage: string;
  timestamp: string; // o Date
  unreadCount: number;
}
