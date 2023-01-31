type NavigationItem = {
  label: string;
  href: string;
};

type FooterItem = {
  heading: string;
  items: NavigationItem[];
};

interface Config {
  site: {
    name: string;
  };

  navigation: {
    nonAuth: NavigationItem[];
    auth: NavigationItem[];
  };

  footer: {
    items: FooterItem[];
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
  footer: {
    items: [
      {
        heading: "Kurumsal",
        items: [
          {
            label: "Hakkımızda",
            href: "/hakkimizda",
          },
          {
            label: "Vizyon & Misyon",
            href: "/vizyon-misyon",
          },
          {
            label: "İletişim",
            href: "/iletisim",
          },
        ],
      },
      {
        heading: "Destek",
        items: [
          {
            label: "Sıkça Sorulan Sorular",
            href: "/sss",
          },
          {
            label: "Gizlilik Politikası",
            href: "/gizlilik-politikasi",
          },
          {
            label: "Kullanım Şartları",
            href: "/kullanim-sartlari",
          },
        ],
      },
      {
        heading: "Sosyal Medya",
        items: [
          {
            label: "Twitter",
            href: "https://twitter.com/punctaapp",
          },
          {
            label: "Instagram",
            href: "https://instagram.com/punctaapp",
          },
          {
            label: "Facebook",
            href: "https://facebook.com/punctaapp",
          },
        ],
      },
    ],
  },
};

export default config;
