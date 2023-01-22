"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

import Button from "@/components/Button";
import { Card } from "@/components/Card";
import TextInput from "@/components/TextInput";
import { cn } from "@/lib/utils";
import { FormikProvider, useFormik } from "formik";
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
    <Card className="mx-auto my-16 max-w-lg p-4 pt-16 pb-8">
      <h1 className="text-center text-3xl font-bold">Giriş Yap</h1>
      <FormikProvider value={formik}>
        <form
          onSubmit={formik.handleSubmit}
          className={cn("flex flex-col space-y-8", "[&>*]:flex [&>*]:flex-col")}
        >
          <TextInput name="email" label="E-posta" />
          <TextInput name="password" label="Şifre" type="password" />
          <div>
            <Button variant="primary" fullWidth>
              Giriş Yap
            </Button>
            <Button variant="text">Şifreni mi unuttun?</Button>
          </div>

          <div className="h-px w-full bg-black"></div>
          <div className="flex w-full items-center justify-center">
            <span className="font-medium">Hesabın yok mu?</span>
            <Button variant="text" asLink href="/kayit-ol" className="p-2 py-0">
              Kayıt ol
            </Button>
          </div>
        </form>
      </FormikProvider>
    </Card>
  );
}
