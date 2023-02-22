import { useContext, useState } from "react";

import BaseMultistepForm from "@/components/BaseMultistepForm";
import Button from "@/components/Button";
import { Card } from "@/components/Card";
import TextInput from "@/components/TextInput";
import config from "@/config";
import { AuthContext } from "@/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

const LoginValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Kullanıcı adı en az 3 karakter olmalıdır.")
    .required("Kullanıcı adı boş bırakılamaz."),
  password: Yup.string()
    .min(8, "Şifre en az 8 karakter olmalıdır.")
    .required("Şifre boş bırakılamaz."),
});

export default function Page() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const [formik, setFormik] = useState<any>({});

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Head>
        <title>{config.site.seo.login.title}</title>
        <meta name="description" content={config.site.seo.login.description} />
      </Head>
      <div className="px-2">
        <Card className="relative mx-auto max-w-lg py-16 px-8">
          {isLoading && (
            <div className="absolute top-0 left-0 z-50 flex h-full w-full flex-col items-center justify-center gap-4 bg-black/80">
              <div className="border-primary-normal h-16 w-16 animate-spin rounded-full border-y-2 border-r-4"></div>
              <p className="px-4 text-center text-xl font-medium text-white">
                Giriş yapılıyor. Lütfen biraz bekle.
              </p>
            </div>
          )}
          <h1 className="mb-4 text-center text-3xl font-medium">Giriş Yap</h1>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: "0px" }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: "0px" }}
            >
              <BaseMultistepForm
                initialValues={{
                  username: "",
                  password: "",
                }}
                validationSchema={LoginValidationSchema}
                onSubmit={async (values) => {
                  setIsLoading(true);
                  authContext
                    .login({
                      username: values.username,
                      password: values.password,
                    })
                    .then((isSuccessfull) => {
                      setIsLoading(false);
                      if (!isSuccessfull) {
                        formik.setErrors({
                          username: "Kullanıcı adı hatalı.",
                          password: "Şifre hatalı.",
                        });
                      } else {
                        router.push("/");
                      }
                    });
                }}
                getFormik={(formik) => setFormik(formik)}
              >
                <TextInput name="username" label="Kullanıcı Adı" />
                <TextInput name="password" label="Şifre" type="password" />
                <div className="mt-8 flex justify-evenly gap-2">
                  <Button variant="primary" fullWidth type="submit">
                    Giriş Yap
                  </Button>
                  <Button variant="text">Şifreni mi unuttun?</Button>
                </div>
                <div className="h-px w-full bg-black"></div>
                <div className="flex w-full items-center justify-center">
                  <span className="font-medium">Hesabın yok mu?</span>
                  <Button
                    variant="text"
                    asLink
                    href="/kayit-ol"
                    className="p-2 py-0"
                  >
                    Kayıt ol
                  </Button>
                </div>
              </BaseMultistepForm>
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </>
  );
}
