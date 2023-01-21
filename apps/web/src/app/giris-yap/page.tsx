"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

import Button from "@/components/Button";
import { Card } from "@/components/Card";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

const LoginValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Kullanıcı adı en az 3 karakter olmalıdır.")
    .max(20, "Kullanıcı adı en fazla 20 karakter olmalıdır.")
    .required("Kullanıcı adı boş bırakılamaz.")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "Kullanıcı adı sadece harf ve rakamlardan oluşmalıdır."
    ),
  password: Yup.string()
    .min(8, "Şifre en az 8 karakter olmalıdır.")
    .required("Şifre boş bırakılamaz."),
});

//TODO: We should redirect the user to the profile page after
// successfull login. Lines: 25,59
export default function Page() {
  type FormValues = {
    username: string;
    password: string;
  };

  const authContext = useContext(AuthContext);
  const router = useRouter();

  const formik = useFormik<FormValues>({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      const response = await authContext.login(
        values.username,
        values.password
      );
      if (response) {
        router.push("/");
      } else {
        formik.errors.username = "Kullanıcı adı hatalı.";
        formik.errors.password = "Şifre hatalı.";
      }
    },
    validationSchema: LoginValidationSchema,
  });

  return (
    <Card className="mx-auto my-16 max-w-lg p-4 pt-16 pb-8">
      <h1 className="text-center text-3xl font-bold">Giriş Yap</h1>
      <form
        onSubmit={formik.handleSubmit}
        className={cn(
          "flex flex-col space-y-8",
          "[&>*]:flex [&>*]:flex-col",

          // Label
          "[&_label]:font-medium [&_label]:text-neutral-700",

          // Input element
          "[&_input]:rounded-full [&_input]:px-4 [&_input]:py-2 [&_input]:transition [&_input]:duration-100",
          "[&_input]:border [&_input]:border-black [&_input]:font-medium [&_input]:outline-none",

          // Error message
          "[&_input~div]:text-sm [&_input~div]:font-medium [&_input~div]:text-red-600"
        )}
      >
        <div>
          <label htmlFor="username">Kullanıcı Adı</label>
          <input
            id="username"
            name="username"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.username}
            className={cn(
              "hover:ring-2 hover:ring-black",
              "focus:ring-2 focus:ring-black"
            )}
          />
          <AnimatePresence>
            {formik.errors.username && formik.touched.username && (
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0,
                }}
                animate={{
                  height: "auto",
                  opacity: 1,
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                }}
              >
                <p className="mt-2">{formik.errors.username}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="password">Şifre</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className={cn(
              "hover:ring-2 hover:ring-black",
              "focus:ring-2 focus:ring-black"
            )}
          />
          <AnimatePresence>
            {formik.errors.password && formik.touched.password && (
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0,
                }}
                animate={{
                  height: "auto",
                  opacity: 1,
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                }}
              >
                <p className="mt-2">{formik.errors.password}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <Button
            variant="primary"
            fullWidth
            // disabled={
            //   formik.dirty || formik.errors.username || formik.errors.password
            //     ? true
            //     : false
            // }
          >
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
    </Card>
  );
}
