import BaseMultistepForm from "@/components/BaseMultistepForm";
import SearchInput from "@/components/SearchInput";
import { SignUpContext } from "@/context/SignUpContext";
import { FormikProps } from "formik";
import { forwardRef, useContext, useState } from "react";

import * as Yup from "yup";
import faculties from "../../data/faculties.json";
import universities from "../../data/universities.json";

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

export default forwardRef<FormikProps<any>>(function UniversityForm(
  props,
  ref
) {
  const signUpContext = useContext(SignUpContext);
  const [currentValues, setCurrentValues] = useState<any>({});

  return (
    <BaseMultistepForm
      ref={ref}
      initialValues={{
        university: signUpContext.university,
        faculty: signUpContext.faculty,
      }}
      validationSchema={UniversityValidationSchema}
      onSubmit={async (values) => {
        signUpContext.setUniversity(values.university);
        signUpContext.setFaculty(values.faculty);

        signUpContext.nextStep();
      }}
      onValuesChange={(values) => {
        setCurrentValues(values);
      }}
    >
      <div>
        <h2 className="text-xl font-medium">Üniversite ve Bölüm</h2>
        <p className="text-sm">
          Sadece kendi bölümündeki öğretmenleri ve kendi üniversiteni puanlaman
          için üniversiteni ve bölümünü girmelisin. Unutma kayıt olurken
          kullandığın e-posta adresi üniversite e-posta adresin olmalı.
        </p>
      </div>
      <SearchInput
        name="university"
        label="Üniversite"
        items={universities.map((u) => u.name)}
      />
      <SearchInput
        name="faculty"
        label="Bölüm"
        items={(function () {
          const selectedUniversity = universities.find(
            (university) => university.name === currentValues.university
          );
          if (!selectedUniversity) {
            return [];
          }
          return selectedUniversity.faculties.map(
            (faculty) => faculties[faculty]
          );
        })()}
      />
    </BaseMultistepForm>
  );
});
