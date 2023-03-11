import Button from "@/components/Button";
import Ratings from "@/components/pages/profil/Ratings";
import { AuthContext } from "@/context/AuthContext";
import { ModalContext } from "@/context/ModalContext";
import { cn } from "@/lib/utils";
import Head from "next/head";
import { useContext } from "react";

export default function Page() {
  const authContext = useContext(AuthContext);
  const modalContext = useContext(ModalContext);

  if (authContext.isFetching) {
    return (
      <>
        <Head>
          <title>{`Profilim | The Puncta`}</title>
        </Head>
        <div className="container mx-auto max-w-6xl">
          <header className={cn("mb-8 px-4")}>
            <h2 className="text-center text-2xl font-medium sm:text-3xl">
              Profilin Yükleniyor...
            </h2>
          </header>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`Profilim | The Puncta`}</title>
      </Head>
      <div className="container mx-auto max-w-6xl">
        <header className={cn("mb-8 px-4")}>
          {!authContext.user ? (
            <h2 className="text-2xl font-medium sm:text-3xl">
              Görünüşe göre giriş yapmamışsın.
            </h2>
          ) : (
            <>
              <div className="mx-auto max-w-lg text-center">
                <h2 className="text-2xl font-medium sm:text-3xl">
                  Profiline hoşgeldin <b>{authContext.user.username}</b>.
                </h2>
                <br></br>
                <h3 className="text-xl font-medium sm:text-2xl">
                  {authContext.user.isAnonymous
                    ? "Şuan anonimsin, dilersen aşağıdaki butona tıklayarak anonimliğini kaldırabilirsin."
                    : "Şuan anonim değilsin, dilersen aşağıdaki butona tıklayarak anonim olarabilirsin."}
                </h3>
                <br></br>
                <Button
                  fullWidth
                  onClick={() => {
                    modalContext.setContent(
                      <div>
                        <h2 className="text-2xl font-medium">
                          {authContext.user?.isAnonymous
                            ? "Anonimliği Kaldır"
                            : "Anonim Ol"}
                        </h2>
                        <br></br>
                        <p className="font-medium">
                          {authContext.user?.isAnonymous
                            ? "Anonimliğini kaldırdıktan sonra değerlendirmelerinde kullanıcı adın gözükecek, aynı zamanda profilinde de tüm değerlendirmelerin gözükür hale gelecek."
                            : "Anonim olduktan sonra yaptığın değerlendirmelerde kullanıcı adın yerine *** yazacak ve profilinde hiçbir değerlendirmen gözükmeyecek."}
                        </p>
                        <br></br>
                        <div className="flex gap-2">
                          <Button
                            variant="text"
                            fullWidth
                            onClick={() => modalContext.setIsOpen(false)}
                          >
                            Hayır Vazgeçtim
                          </Button>
                          <Button
                            fullWidth
                            onClick={() => {
                              authContext
                                .setAnonymity(!authContext.user?.isAnonymous)
                                .then((response) => {
                                  if (!response) return;
                                  modalContext.setIsOpen(false);
                                });
                            }}
                          >
                            {authContext.user?.isAnonymous
                              ? "Anonimliğimi Kaldır"
                              : "Anonim Ol"}
                          </Button>
                        </div>
                      </div>
                    );
                    modalContext.setIsOpen(true);
                  }}
                >
                  {authContext.user.isAnonymous
                    ? "Anonimliğimi Kaldır"
                    : "Anonim Ol"}
                </Button>
                <Button
                  variant="text"
                  fullWidth
                  asLink
                  href={`/profil/${authContext.user.username}`}
                >
                  Profilim dışarıdan nasıl görünüyor?
                </Button>
              </div>
              <br></br>
              <div>
                <h2 className="text-2xl font-medium sm:text-3xl">
                  Değerlendirmelerim
                </h2>
                <br></br>
                <main>
                  {authContext.user.ratings &&
                  authContext.user.ratings.length > 0 ? (
                    <Ratings ratings={authContext.user.ratings} />
                  ) : (
                    <h3 className="text-xl font-medium sm:text-2xl">
                      Henüz değerlendirme yapmadın.
                    </h3>
                  )}
                </main>
              </div>
            </>
          )}
        </header>
      </div>
    </>
  );
}
