import { useContext, useState } from "react";

import BaseMultistepForm from "@/components/BaseMultistepForm";
import Button from "@/components/Button";
import { Card } from "@/components/Card";
import TextInput from "@/components/TextInput";
import { AuthContext } from "@/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
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

  return (
    <Card className="mx-auto max-w-lg py-16 px-8">
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
              const response = await authContext.login({
                username: values.username,
                password: values.password,
              });
              if (response) {
                router.push("/");
              } else {
                formik.setErrors({
                  username: "Kullanıcı adı hatalı.",
                  password: "Şifre hatalı.",
                });
              }
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
  );
}
