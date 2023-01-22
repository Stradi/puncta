import { SignUpContext } from "@/context/SignUpContext";
import { cn } from "@/lib/utils";
import { FormikProps, useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useContext, useImperativeHandle } from "react";

import * as Yup from "yup";
const PasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Şifre en az 8 karakter olmalıdır.")
    .required("Şifre boş bırakılamaz."),
  confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor.")
    .required("Şifre tekrarı boş bırakılamaz."),
});

type PasswordFormValues = {
  password: string;
  confirmation: string;
};

const PasswordForm = forwardRef<FormikProps<PasswordFormValues>>(
  (props, ref) => {
    const signUpContext = useContext(SignUpContext);

    const formik = useFormik<PasswordFormValues>({
      initialValues: {
        password: signUpContext.password,
        confirmation: signUpContext.password,
      },
      onSubmit: (values) => {
        signUpContext.setPassword(values.password);
        signUpContext.nextStep();
      },
      validationSchema: PasswordValidationSchema,
      innerRef: ref,
    });

    useImperativeHandle(ref, () => ({
      ...formik,
    }));

    return (
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
          <h2 className="text-xl font-medium">Şifre</h2>
          <p className="text-sm">Kendine güvenli bir şifre seçmeyi unutma.</p>
        </div>
        <div>
          <label htmlFor="password">Şifre</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          <AnimatePresence>
            {formik.errors.password && formik.touched.password ? (
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
                {formik.errors.password}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div>
          <label htmlFor="confirmation">Şifre tekrarı</label>
          <input
            id="confirmation"
            name="confirmation"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.confirmation}
          />
          <AnimatePresence>
            {formik.errors.confirmation && formik.touched.confirmation ? (
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
                {formik.errors.confirmation}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </form>
    );
  }
);

PasswordForm.displayName = "BasicInformationForm";
export default PasswordForm;
