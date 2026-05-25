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
  giscus?: {
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
    mapping?: string;
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
  giscus: {
    repo: "XVVQAQ/XVVQAQ-Blog",
    repoId: "R_kgDORVr0Rg",
    category: "General",
    categoryId: "DIC_kwDORVr0Rs4C90Y9",
    mapping: "og:title",
  },
};
