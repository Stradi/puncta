import BaseMultistepForm from "@/components/BaseMultistepForm";
import TextInput from "@/components/TextInput";
import { SignUpContext } from "@/context/SignUpContext";
import { FormikProps } from "formik";
import { forwardRef, useContext } from "react";

import * as Yup from "yup";
const PasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Şifre en az 8 karakter olmalıdır.")
    .required("Şifre boş bırakılamaz."),
  confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor.")
    .required("Şifre tekrarı boş bırakılamaz."),
});

export default forwardRef<FormikProps<any>>(function PasswordForm(props, ref) {
  const signUpContext = useContext(SignUpContext);
  return (
    <BaseMultistepForm
      ref={ref}
      initialValues={{
        password: signUpContext.password,
        confirmation: signUpContext.password,
      }}
      validationSchema={PasswordValidationSchema}
      onSubmit={(values) => {
        signUpContext.setPassword(values.password);
        signUpContext.nextStep();
      }}
    >
      <div>
        <h2 className="text-xl font-medium">Şifre</h2>
        <p className="text-sm">Kendine güvenli bir şifre seçmeyi unutma.</p>
      </div>
      <TextInput name="password" label="Şifre" type="password" />
      <TextInput name="confirmation" label="Şifre Tekrarı" type="password" />
    </BaseMultistepForm>
  );
});
