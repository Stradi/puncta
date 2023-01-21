import { SignUpContext } from "@/context/SignUpContext";
import { cn } from "@/lib/utils";
import { FormikProps, useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import * as Yup from "yup";
import faculties from "./faculties.json";
import universities from "./universities.json";

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
    const [filteredUniversities, setFilteredUniversities] =
      useState(universities);

    const [filteredFaculties, setFilteredFaculties] = useState(faculties);

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

    useEffect(() => {
      const newUniversities = universities
        .filter((uni) =>
          uni.name
            .toLowerCase()
            .replaceAll(" ", "")
            .includes(
              formik.values.university.toLowerCase().replaceAll(" ", "")
            )
        )
        .slice(0, 5);

      setFilteredUniversities(newUniversities);
    }, [formik.values.university]);

    useEffect(() => {
      const allFaculties = universities
        .find((u) => u.name === formik.values.university)
        ?.faculties.map((f) => faculties[f]);
      const filteredFaculties = allFaculties?.filter((f) =>
        f.toLowerCase().includes(formik.values.faculty.toLowerCase())
      );

      setFilteredFaculties(filteredFaculties || []);
    }, [formik.values.faculty, formik.values.university]);

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
          <h2 className="text-xl font-medium">Üniversite ve Bölüm</h2>
          <p className="text-sm">
            Sadece kendi üniversitendeki öğretmenleri puanlaman için
            üniversiteni ve bölümünü girmelisin.
          </p>
        </div>
        <div>
          <label htmlFor="university">Üniversite</label>
          <input
            id="university"
            name="university"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.university}
          />
          <div>
            <ul>
              {filteredUniversities.map((university) => (
                <li key={university.name}>{university.name}</li>
              ))}
            </ul>
          </div>
          <AnimatePresence>
            {formik.errors.university ? (
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
                {formik.errors.university}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div>
          <label htmlFor="faculty">Bölüm</label>
          <input
            id="faculty"
            name="faculty"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.faculty}
          />
          <div>
            <ul>
              {filteredFaculties.map((faculty) => (
                <li key={faculty}>{faculty}</li>
              ))}
            </ul>
          </div>
          <AnimatePresence>
            {formik.errors.faculty ? (
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
                {formik.errors.faculty}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </form>
    );
  }
);

UniversityForm.displayName = "UniversityForm";
export default UniversityForm;
