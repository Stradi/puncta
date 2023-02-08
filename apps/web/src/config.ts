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
    auth: {
      student: NavigationItem[];
      teacher: NavigationItem[];
    };
  };

  footer: {
    items: FooterItem[];
  };

  landing: {
    stats: {
      text: string;
      value: string;
    }[];
    features: {
      title: string;
      subtitle: string;
      bgImage: string;
      color: string;
      image: string;
    }[];
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
      {
        label: "Arama Yap",
        href: "/ara",
      },
    ],
    auth: {
      student: [
        {
          label: "Tüm Üniversiteler",
          href: "/universiteler",
        },
        {
          label: "Değerlendir",
          href: "/degerlendir",
        },
        {
          label: "Arama Yap",
          href: "/ara",
        },
      ],
      teacher: [
        {
          label: "Tüm Üniversiteler",
          href: "/universiteler",
        },
        {
          label: "Değerlendirenler",
          href: "/degerlendirenler",
        },
        {
          label: "Arama Yap",
          href: "/ara",
        },
      ],
    },
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
  landing: {
    stats: [
      {
        text: "Değerlendirme",
        value: "20K+",
      },
      {
        text: "Üniversite",
        value: "200+",
      },
      {
        text: "Yorum",
        value: "3K+",
      },
      {
        text: "Öğretim Üyesi",
        value: "180K+",
      },
    ],
    features: [
      {
        title: "Tamamen Anonimsin",
        subtitle:
          "Yani yapılan tüm değerlendirmeler ve yorumlar gizli, kimse göremiyor. Biz bile göremiyoruz.",
        color: "bg-primary-light",
        bgImage: "/images/tamamen-anonimsin.png",
        image: "",
      },
      {
        title: "Tüm Öğrenciler İçin",
        subtitle:
          "Öğrencilerin değerlendirmeleri ve yorumları öğretmenler için çok önemli.",
        color: "bg-primary-light",
        bgImage: "/images/tum-ogrenciler-icin.png",
        image: "",
      },
      {
        title: "Sesini Duyur",
        subtitle:
          "Öğretmenlerini ve üniversiteni punlayarak daha iyi bir eğitim ortamı yaratmamıza yardımcı ol.",
        color: "bg-primary-light",
        bgImage: "/images/sesini-duyur.png",
        image: "",
      },
    ],
  },
};

export default config;
