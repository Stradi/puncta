import BaseMultistepForm from "@/components/BaseMultistepForm";
import TextInput from "@/components/TextInput";
import { SignUpContext } from "@/context/SignUpContext";
import { checkEmailExists, checkUsernameExists } from "@/lib/auth";
import { FormikProps } from "formik";
import { forwardRef, useContext } from "react";
import * as yup from "yup";

const StudentInformationValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("E-posta adresi geçersiz.")
    .required("E-posta boş bırakılamaz.")
    .test(
      "Kayıtlı E-posta",
      "Bu e-posta adresi zaten kayıtlı.",
      async function (value) {
        if (!value) {
          return false;
        }
        return !(await checkEmailExists(value as string));
      }
    ),
  username: yup
    .string()
    .min(3, "Kullanıcı adı en az 3 karakter olmalıdır.")
    .required("Kullanıcı adı boş bırakılamaz.")
    .test(
      "Kayıtlı kullanıcı adı",
      "Bu kullanıcı adı zaten kayıtlı.",
      async function (value) {
        if (!value) {
          return false;
        }
        return !(await checkUsernameExists(value as string));
      }
    ),
});

export default forwardRef<FormikProps<any>>(function StudentInformationForm(
  props,
  ref
) {
  const signUpContext = useContext(SignUpContext);
  return (
    <BaseMultistepForm
      ref={ref}
      initialValues={{
        email: signUpContext.email,
        username: signUpContext.username,
      }}
      validationSchema={StudentInformationValidationSchema}
      onSubmit={(values) => {
        signUpContext.setEmail(values.email);
        signUpContext.setUsername(values.username);
        signUpContext.nextStep();
      }}
    >
      <div>
        <h2 className="text-xl font-medium">Genel Bilgiler</h2>
        <p className="text-sm">
          E-postan ve adın sizin gerçekten öğrenci olup olmadığını kontrol etmek
          için kullanılacak. Bunun için üniversite e-postanı kullanman
          gerekiyor. Ayrıca kullanıcı adında kendini tanıtabilecek bir şey
          kullanmamanı öneririz.
        </p>
      </div>
      <TextInput name="username" label="Kullanıcı adı" type="text" />
      <TextInput name="email" label="E-posta" type="email" />
    </BaseMultistepForm>
  );
});
