import BaseMultistepForm from "@/components/BaseMultistepForm";
import TextInput from "@/components/TextInput";
import { SignUpContext } from "@/context/SignUpContext";
import { checkEmailExists } from "@/lib/auth";
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
  name: yup
    .string()
    .min(3, "Ad en az 3 karakter olmalıdır.")
    .required("Ad boş bırakılamaz.")
    .test(
      "Only firstname",
      "Galiba sadece adını girmişsin, lütfen soyadını da gir.",
      function (value) {
        if (!value) {
          return false;
        }
        const fullName = value.trim();

        const arr = fullName.split(" ");
        return arr.length > 1;
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
        name:
          signUpContext.firstName && signUpContext.lastName
            ? `${signUpContext.firstName} ${signUpContext.lastName}`
            : "",
      }}
      validationSchema={StudentInformationValidationSchema}
      onSubmit={(values) => {
        const arr = values.name.trim().split(" ");
        signUpContext.setEmail(values.email);
        signUpContext.setFirstName(arr[0]);
        signUpContext.setLastName(arr[1]);
        signUpContext.nextStep();
      }}
    >
      <div>
        <h2 className="text-xl font-medium">Genel Bilgiler</h2>
        <p className="text-sm">
          E-postan ve adın senin kim olduğunu anlamamız için önemlidir.
        </p>
      </div>
      <TextInput name="name" label="Ad Soyad" type="text" />
      <TextInput name="email" label="E-posta" type="email" />
    </BaseMultistepForm>
  );
});
