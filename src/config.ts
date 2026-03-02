interface Config {
  site: {
    BASE_URL: string;
    SITE_TITLE: string;
    SITE_SUBTITLE: string;
    AUTHOR: string;
    AVATAR?: string;
  };
  page: {
    PAGE_SIZE: number;
  };
}

export const config: Config = {
  site: {
    BASE_URL: "/",
    SITE_TITLE: "XVVQAQ's Blog",
    SITE_SUBTITLE: "随便写写",
    AUTHOR: "XVVQAQ",
    AVATAR: "/avatar.jpg",
  },
  page: {
    PAGE_SIZE: 10,
  },
};
