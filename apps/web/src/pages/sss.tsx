import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <title>Sıkça Sorulan Sorular | The Puncta</title>
      </Head>
      <main className="container mx-auto max-w-6xl space-y-16 px-2">
        <header>
          <h1 className="text-center text-3xl font-bold md:text-6xl">
            Sıkça Sorulan Sorular (SSS)
          </h1>
        </header>
        <section className="prose prose-neutral prose-lg mx-auto">
          <ol type="1">
            <li>
              <h3>Üye olmadan değerlendirme yapabilir miyim?</h3>
              <p>
                Değerlendirme yapabilmeniz için üye olmanız gerekmektedir,
                öğrenci olarak değerlendirme ve yorum yapabilmeniz için
                üniversitenizin size sağladığı “.edu” uzantılı “Öğrenci Maili”
                ile kayıt olmanız zorunludur.
              </p>
            </li>
            <li>
              <h3>
                Değerlendirme ya da yorum yaparken adım ve kişisel bilgilerim
                gözükecek mi?
              </h3>
              <p>
                Yaptığınız tüm yorum ve değerlendirmeleri tamamen “Anonim”
                şekilde ya da kullanıcı adı olarak tanımlayabileceğiniz “Rumuz”
                kullanarak yapabilirsiniz. Sistemimize üye olurken girdiğiniz
                kişisel bilgileriniz ve öğrenim bilgileriniz “KVKK” ve “Açık
                Rıza Metnimiz” kapsamınca tarafımızda kimseyle paylaşmamak üzere
                saklanmaktadır.
              </p>
            </li>
            <li>
              <h3>
                Değerlendirme ya da yorum yapabilmek için öğrenci olmam şart mı?
              </h3>
              <p>
                Akademik değerlendirme yapabilmek için değerlendirme yapmak
                istediğiniz kurumda (Üniversite) ve ilgili bölümde öğrenim
                gördüğünüzü doğrulamanız zorunludur.
              </p>
            </li>
            <li>
              <h3>
                Adıma yapılmış değerlendirme ya da yorumlara cevap verebilir
                miyim?
              </h3>
              <p>
                Öğretim üyesi olmanız durumunda, adınıza yapılmış bir
                değerlendirme ya da yoruma cevap verme hakkınız vardır, bunun
                için söz konusu kişi olduğunuzu doğrulamanız, bağlı olduğunuz
                kurumun (Üniversite) size sağladığı “.edu” uzantılı mailiniz ile
                “Öğretmen” üyeliği gerçekleştirebilir ve değerlendirmelere yanıt
                verebilirsiniz.
              </p>
            </li>
            <li>
              <h3>Öğretim üyeleri de değerlendirme ve yorum yapabilir mi?</h3>
              <p>
                Hayır. The Puncta öğrenciler için kurulmuş bir platform olduğu
                için sadece öğrenciler değerlendirme yapabilir.
              </p>
            </li>
            <li>
              <h3>Neden doğrulama yapmak zorundayım?</h3>
              <p>
                The Puncta olarak, objektifliğe ve ifade özgürlüğüne çok önem
                veriyoruz, ancak akademik hayat içerisinde ki kişi ve kurumların
                da haklarını korumak zorundayız. Gerçek olmayan değerlendirme,
                yorum ya da eleştirilere imkan tanımamak için değerlendirme
                yapacak kişilerin, ilgili kurumlarda öğrenim gördüğünü
                doğrulamakla yükümlüyüz.
              </p>
            </li>
          </ol>
        </section>
      </main>
    </>
  );
}
