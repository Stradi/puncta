import TextInput from "@/components/TextInput";
import { SignUpContext } from "@/context/SignUpContext";
import { cn } from "@/lib/utils";
import { FormikProps, FormikProvider, useFormik } from "formik";
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
      <FormikProvider value={formik}>
        <form
          onSubmit={formik.handleSubmit}
          className={cn("flex flex-col space-y-8", "[&>*]:flex [&>*]:flex-col")}
        >
          <div>
            <h2 className="text-xl font-medium">Şifre</h2>
            <p className="text-sm">Kendine güvenli bir şifre seçmeyi unutma.</p>
          </div>
          <TextInput name="password" label="Şifre" type="password" />
          <TextInput
            name="confirmation"
            label="Şifre Tekrarı"
            type="password"
          />
        </form>
      </FormikProvider>
    );
  }
);

PasswordForm.displayName = "BasicInformationForm";
export default PasswordForm;
