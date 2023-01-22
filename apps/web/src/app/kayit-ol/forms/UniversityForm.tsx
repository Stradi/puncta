import TextInput from "@/components/TextInput";
import { SignUpContext } from "@/context/SignUpContext";
import { cn } from "@/lib/utils";
import { FormikProps, FormikProvider, useFormik } from "formik";
import { forwardRef, useContext, useImperativeHandle } from "react";

import * as Yup from "yup";
import faculties from "../data/faculties.json";
import universities from "../data/universities.json";

const UniversityFieldSchema = Yup.string()
  .oneOf(
    universities.map((university) => university.name),
    "Lütfen geçerli bir üniversite seçiniz."
  )
  .required("Üniversite boş bırakılamaz.");

const FacultyFieldSchema = Yup.string().when(
  ["university"],
  (university, schema) => {
    const isUniversityValid = UniversityFieldSchema.isValidSync(university);
    if (!isUniversityValid) {
      return schema;
    }

    const selectedUniversity = universities.find(
      (universityItem) => universityItem.name === university
    );

    const availableFaculties = selectedUniversity?.faculties.map(
      (facultyItem) => faculties[facultyItem]
    );

    return schema
      .oneOf(availableFaculties, "Lütfen geçerli bir bölüm seçiniz.")
      .required("Bölüm boş bırakılamaz.");
  }
);

const UniversityValidationSchema = Yup.object().shape({
  university: UniversityFieldSchema,
  faculty: FacultyFieldSchema,
});

type UniversityFormValues = {
  university: string;
  faculty: string;
};

const UniversityForm = forwardRef<FormikProps<UniversityFormValues>>(
  (props, ref) => {
    const signUpContext = useContext(SignUpContext);

    const formik = useFormik<UniversityFormValues>({
      initialValues: {
        university: signUpContext.university,
        faculty: signUpContext.faculty,
      },
      onSubmit: async (values) => {
        signUpContext.setUniversity(values.university);
        signUpContext.setFaculty(values.faculty);

        signUpContext.nextStep();
      },
      validationSchema: UniversityValidationSchema,
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
            <h2 className="text-xl font-medium">Üniversite ve Bölüm</h2>
            <p className="text-sm">
              Sadece kendi üniversitendeki öğretmenleri puanlaman için
              üniversiteni ve bölümünü girmelisin.
            </p>
          </div>
          <TextInput name="university" label="Üniversite" type="text" />
          <TextInput name="faculty" label="Bölüm" type="text" />
        </form>
      </FormikProvider>
    );
  }
);

UniversityForm.displayName = "UniversityForm";
export default UniversityForm;
