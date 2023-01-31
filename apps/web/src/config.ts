type NavigationItem = {
  label: string;
  href: string;
};

interface Config {
  site: {
    name: string;
  };

  navigation: {
    nonAuth: NavigationItem[];
    auth: NavigationItem[];
  };
}

const config: Config = {
  site: {
    name: "Puncta.",
  },
  navigation: {
    nonAuth: [
      {
        label: "Tüm Üniversiteler",
        href: "/universiteler",
      },
    ],
    auth: [
      {
        label: "Tüm Üniversiteler",
        href: "/universiteler",
      },
      {
        label: "Değerlendir",
        href: "/degerlendir",
      },
    ],
  },
};

export default config;
