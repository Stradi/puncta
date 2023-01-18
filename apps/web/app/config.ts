type NavigationItem = {
  label: string;
  href: string;
};

interface Config {
  site: {
    name: string;
  };

  navigation: {
    primary: NavigationItem[];
  };
}

const config: Config = {
  site: {
    name: "Puncta.",
  },
  navigation: {
    primary: [
      {
        label: "Test",
        href: "/",
      },
      {
        label: "Another Test",
        href: "/",
      },
      {
        label: "Yet Another Test",
        href: "/",
      },
    ],
  },
};

export default config;
