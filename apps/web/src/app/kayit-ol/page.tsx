"use client";

import Button from "@/components/Button";
import { Card } from "@/components/Card";
import { AuthContext } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import * as Yup from "yup";

const SignUpValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("E-posta adresi geçersiz.")
    .required("E-posta boş bırakılamaz."),
  username: Yup.string()
    .min(3, "Kullanıcı adınız en az 3 karakter olmalıdır.")
    .max(20, "Kullanıcı adınız en fazla 20 karakter olmalıdır.")
    .required("Kullanıcı adı boş bırakılamaz.")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "Kullanıcı adınız sadece harf ve rakamlardan oluşmalıdır."
    ),
  password: Yup.string()
    .min(8, "Şifreniz en az 8 karakter olmalıdır.")
    .required("Şifre boş bırakılamaz."),
});

export default function Page() {
  type FormValues = {
    email: string;
    username: string;
    password: string;
  };

  const authContext = useContext(AuthContext);
  const router = useRouter();

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      //TODO:
      const response = await authContext.register(
        values.email,
        values.username,
        values.password
      );
      if (response) {
        router.push("/");
      } else {
        formik.errors.email = "Bu e-posta adresi zaten kayıtlı.";
        formik.errors.username = "Bu kullanıcı adı zaten kayıtlı.";
      }
    },
    validationSchema: SignUpValidationSchema,
  });

  return (
    <Card className="mx-auto my-16 max-w-lg p-4 pt-16 pb-8">
      <h1 className="text-center text-3xl font-bold">Kayıt Ol</h1>
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
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.email}
            className={cn(
              "hover:ring-2 hover:ring-black",
              "focus:ring-2 focus:ring-black"
            )}
          />
          <AnimatePresence>
            {formik.errors.email && formik.touched.email && (
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
                <p className="mt-2">{formik.errors.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
          <Button variant="primary" fullWidth>
            Kayıt Ol
          </Button>
        </div>

        <div className="h-px w-full bg-black"></div>
        <div className="flex w-full items-center justify-center">
          <span className="font-medium">Zaten üye misin?</span>
          <Button variant="text" asLink href="/giris-yap" className="p-2 py-0">
            Giriş Yap
          </Button>
        </div>
      </form>
    </Card>
  );
}
