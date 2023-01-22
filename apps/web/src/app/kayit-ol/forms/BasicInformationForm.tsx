import TextInput from "@/components/TextInput";
import { SignUpContext } from "@/context/SignUpContext";
import { checkEmailExists } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { FormikProps, FormikProvider, useFormik } from "formik";
import { forwardRef, useContext, useImperativeHandle } from "react";
import * as yup from "yup";

const BasicInformationValidationSchema = yup.object().shape({
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

type BasicInformationFormValues = {
  email: string;
  name: string;
};

const BasicInformationForm = forwardRef<
  FormikProps<BasicInformationFormValues>
>((props, ref) => {
  const signUpContext = useContext(SignUpContext);

  const formik = useFormik<BasicInformationFormValues>({
    initialValues: {
      email: signUpContext.email,
      name:
        signUpContext.firstName && signUpContext.lastName
          ? `${signUpContext.firstName} ${signUpContext.lastName}`
          : "",
    },
    onSubmit: (values) => {
      signUpContext.setEmail(values.email);

      // TODO: Find a better way to handle this
      // TODO: Also convert to title case
      const fullName = values.name.trim();
      const [firstName, lastName] = fullName.split(" ");
      signUpContext.setFirstName(firstName);
      signUpContext.setLastName(lastName);

      signUpContext.nextStep();
    },
    validationSchema: BasicInformationValidationSchema,
    // To prevent sending request to API server on every keypress
    validateOnChange: false,
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
          <h2 className="text-xl font-medium">Genel Bilgiler</h2>
          <p className="text-sm">
            E-postan ve adın senin kim olduğunu anlamamız için önemlidir.
          </p>
        </div>
        <TextInput name="name" label="Ad Soyad" type="text" />
        <TextInput name="email" label="E-posta" type="email" />
      </form>
    </FormikProvider>
  );
});

BasicInformationForm.displayName = "BasicInformationForm";
export default BasicInformationForm;
