import { CheckIcon, PathIcon, QuoteIcon, SearchIcon } from "@/components/Icons";
import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <title>Hakkımızda | The Puncta</title>
      </Head>
      <main className="container mx-auto max-w-6xl space-y-16 px-2">
        <header>
          <h1 className="text-center text-3xl font-bold md:text-6xl">
            Hakkımızda
          </h1>
        </header>
        <section className="mx-auto flex max-w-xl flex-col gap-8">
          <blockquote className="relative mb-8 text-xl font-medium md:text-2xl">
            <QuoteIcon
              stroke="thick"
              svgClassName="-z-10 absolute -top-8 left-0 md:-left-4 h-16 w-16 text-gray-200 rotate-180"
            />
            <QuoteIcon
              stroke="thick"
              svgClassName="-z-10 absolute bottom-0 md:-bottom-8 right-0 h-16 w-16 text-gray-200"
            />
            <div className="relative">
              <p className="text-center md:text-left	md:before:content-['\2001']">
                Öğrenciler olarak üniversiteleri ve öğretim üyelerini
                değerlendirerek akademik eğitim kalitesini birlikte yükseltelim.
              </p>
            </div>
          </blockquote>
          <div className="space-y-8 text-lg md:text-xl">
            <p className="">
              The Puncta, tüm üniversite öğrencilerinin eleştirilerini,
              şikayetlerini, taleplerini ya da akademik düşüncelerini anonim
              olarak ya da olmadan özgürce değerlendirebilecekleri bir
              platformdur.
            </p>
            <p className="text-right">
              Sistemimizde ki 225 üniversite ve 100 binden fazla öğretim
              üyesiyle öğrencilere tamamen ücretsiz ve özgür bir eleştiri ortamı
              sağlayarak, eğitim gördükleri kurumlara ve öğretmenlerine “Not
              Verme” imkanı veriyoruz.
            </p>
            <p className="">
              The Puncta, kurumların kalitesine doğrudan etki etmek ve akademik
              eğitimde ki gelişimin, öğrenciler ve üniversite üyelerinin tecrübe
              ya da taleplerine dayanarak birinci elden katkı sağlamasını
              amaçlar.
            </p>
          </div>
          <div className="space-y-8">
            <h2 className="text-center text-3xl font-bold">Neden Gerekli?</h2>
            <div className="relative space-y-4 text-lg">
              <CheckIcon
                stroke="thick"
                svgClassName="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-24 text-gray-200 -z-10"
              />
              <h3 className="text-2xl font-medium">Çözüm Arayışı</h3>
              <p>
                Üniversite öğrencilerinin akademik hayatta yaşadığı çeşitli
                sorunlar karşısında çözümsüz ve muhatapsız kalması durumlarının
                önüne geçmek için.
              </p>
            </div>
            <div className="relative space-y-4 text-lg">
              <PathIcon
                stroke="thick"
                svgClassName="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-24 text-gray-200 -z-10"
              />
              <h3 className="text-2xl font-medium">Tercih Dönemleri</h3>
              <p>
                Üniversite tercih dönemlerinde adayların yerleşmek istedikleri
                üniversiteler hakkında detaylı bilgi sahibi olabilmeleri ve daha
                önce yapılan yorum ya da değerlendirmelere göre tercihleri
                arasında karşılaştırma yapabilmesi için.
              </p>
            </div>
            <div className="relative space-y-4 text-lg">
              <SearchIcon
                stroke="thick"
                svgClassName="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-24 text-gray-200 -z-10"
              />
              <h3 className="text-2xl font-medium">
                Kurumlar İçin Gözlem Fırsatı
              </h3>
              <p>
                Yapılan değerlendirme, yorum ve taleplere göre eğitim verenlerin
                ve ya üniversitelerin çözümsüz kalan sorunları, eksiklikleri,
                talepleri ve şikayetleri rahatça tespit etmesiyle aksiyon
                alabilme fırsatı tanır.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
