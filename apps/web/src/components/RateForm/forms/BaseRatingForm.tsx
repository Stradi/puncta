import { RateContext } from "@/context/RateContext";
import { cn } from "@/lib/utils";
import { FormikProps, FormikProvider, useFormik } from "formik";
import { forwardRef, useContext, useImperativeHandle } from "react";

import * as yup from "yup";
import RateInput from "../RateInput";

const BaseRatingFormValidationSchema = yup.object().shape({
  rating: yup
    .number()
    .min(0, "Genel değerlendirme puanı 0'dan küçük olamaz")
    .max(5, "Genel değerlendirme puanı 5'den büyük olamaz")
    .required("Genel değerlendirme puanı boş bırakılamaz"),
});

interface BaseRatingFormValues {
  rating: number;
}

// This component will be used for both rating teacher and university
const BaseRatingForm = forwardRef<FormikProps<BaseRatingFormValues>>(
  (props, ref) => {
    const rateContext = useContext(RateContext);

    const formik = useFormik<BaseRatingFormValues>({
      initialValues: {
        rating: rateContext.rating,
      },
      validationSchema: BaseRatingFormValidationSchema,
      onSubmit: (values) => {
        console.log(values.rating);
        rateContext.setRating(values.rating);
        rateContext.nextStep();
      },
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
            <p className="text-lg">
              Değerlendirmeni 5 puan üzerinden yapacak olsan kaç verirsin?
            </p>
          </div>
          <RateInput
            name="rating"
            label="Genel Değerlendirme"
            steps={[
              {
                value: 1,
                text: "1",
              },
              {
                value: 2,
                text: "2",
              },
              {
                value: 3,
                text: "3",
              },
              {
                value: 4,
                text: "4",
              },
              {
                value: 5,
                text: "5",
              },
            ]}
          />
        </form>
      </FormikProvider>
    );
  }
);

BaseRatingForm.displayName = "BaseRatingForm";
export default BaseRatingForm;
