export interface ChatPreview {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  unreadCount: number;
  avatarColors: [string, string];
  initials: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  time: string;
  isMine: boolean;
}
