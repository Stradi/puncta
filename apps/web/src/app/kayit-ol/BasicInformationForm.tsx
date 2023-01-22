import { SignUpContext } from "@/context/SignUpContext";
import { cn } from "@/lib/utils";
import { FormikProps, useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useContext, useImperativeHandle } from "react";

import * as Yup from "yup";
const BasicInformationValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("E-posta adresi geçersiz.")
    .required("E-posta boş bırakılamaz."),
  name: Yup.string()
    .min(3, "Ad en az 3 karakter olmalıdır.")
    .required("Ad boş bırakılamaz."),
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
      name: `${signUpContext.firstName} ${signUpContext.lastName}`,
    },
    onSubmit: (values) => {
      signUpContext.setEmail(values.email);

      const [firstName, lastName] = values.name.split(" ");
      signUpContext.setFirstName(firstName);
      signUpContext.setLastName(lastName);

      signUpContext.nextStep();
    },
    validationSchema: BasicInformationValidationSchema,
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
        <h2 className="text-xl font-medium">Genel Bilgiler</h2>
        <p className="text-sm">
          E-postan ve adın senin kim olduğunu anlamamız için önemlidir.
        </p>
      </div>
      <div>
        <label htmlFor="email">E-posta</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <AnimatePresence>
          {formik.errors.email && formik.touched.email ? (
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
              {formik.errors.email}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div>
        <label htmlFor="name">Ad Soyad</label>
        <input
          id="name"
          name="name"
          type="name"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        <AnimatePresence>
          {formik.errors.name && formik.touched.name ? (
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
              {formik.errors.name}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
});

BasicInformationForm.displayName = "BasicInformationForm";
export default BasicInformationForm;
