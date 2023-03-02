import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <title>İletişim | The Puncta</title>
      </Head>
      <main className="container mx-auto max-w-6xl space-y-16 px-2">
        <header>
          <h1 className="text-center text-3xl font-bold md:text-6xl">
            İletişim
          </h1>
        </header>
        <section className="prose prose-lg prose-neutral mx-auto">
          <p>
            Her türlü görüş, öneri ve şikayetleriniz için bizimle iletişime
            geçebilirsiniz. Aşağıda bize doğrudan ulaşabileceğiniz bir e-posta
            adresi bulunmaktadır. İsteklerinizi, önerilerini veya
            şikayetlerinizi aşağıdaki e-posta adresine doğrudan
            gönderebilirsiniz.
          </p>
          <div>
            <p>
              E-posta adresimiz:{" "}
              <a href="mailto:legal@thepuncta.com">legal@thepuncta.com</a>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
