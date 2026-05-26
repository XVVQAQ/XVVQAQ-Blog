export interface FriendLink {
  avatar: string;
  name: string;
  description?: string;
  tags?: string[];
  url: string;
  hoverDescription?: string;
}

export const friendLinks: FriendLink[] = [
  {
    avatar: "https://avatars.githubusercontent.com/u/62936489",
    name: "PTALTS-LK",
    description: "PTALTS-LK的博客",
    url: "https://ptalts-lk.github.io/",
    hoverDescription: "手台领域大蛇(x)",
  },
];
