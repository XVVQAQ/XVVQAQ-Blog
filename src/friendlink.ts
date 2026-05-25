export interface FriendLink {
  avatar: string;
  name: string;
  description?: string;
  tags?: string[];
  url: string;
  hoverDescription?: string;
}

export const friendLinks: FriendLink[] = [{}];
