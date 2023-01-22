"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

import Button from "@/components/Button";
import { Card } from "@/components/Card";
import TextInput from "@/components/TextInput";
import { cn } from "@/lib/utils";
import { FormikProvider, useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

const LoginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Geçerli bir e-posta adresi giriniz.")
    .required("E-posta boş bırakılamaz."),
  password: Yup.string()
    .min(8, "Şifre en az 8 karakter olmalıdır.")
    .required("Şifre boş bırakılamaz."),
});

//TODO: We should redirect the user to the profile page after
// successfull login. Lines: 25,59
export default function Page() {
  type FormValues = {
    email: string;
    password: string;
  };

  const authContext = useContext(AuthContext);
  const router = useRouter();

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      const response = await authContext.login({
        email: values.email,
        password: values.password,
      });
      if (response) {
        router.push("/");
      } else {
        formik.errors.email = "Email hatalı.";
        formik.errors.password = "Şifre hatalı.";
      }
    },
    validationSchema: LoginValidationSchema,
  });

  return (
    <Card className="mx-auto mt-16 max-w-lg py-16 px-8">
      <h1 className="mb-4 text-center text-3xl font-medium">Giriş Yap</h1>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: "0px" }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: "0px" }}
        >
          <FormikProvider value={formik}>
            <form
              onSubmit={formik.handleSubmit}
              className={cn(
                "flex flex-col space-y-4",
                "[&>*]:flex [&>*]:flex-col"
              )}
            >
              <TextInput name="email" label="E-posta" />
              <TextInput name="password" label="Şifre" type="password" />
              <div className="mt-8 flex justify-evenly gap-2">
                <Button variant="primary" fullWidth>
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
            </form>
          </FormikProvider>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
