import TextareaInput from "@/components/TextareaInput";
import { RateContext } from "@/context/RateContext";
import { cn } from "@/lib/utils";
import { FormikProps, FormikProvider, useFormik } from "formik";
import { forwardRef, useContext, useImperativeHandle } from "react";

import * as yup from "yup";
import RateInput from "../RateInput";

const BaseRatingFormValidationSchema = yup.object().shape({
  rating: yup.number().min(1, "Genel değerlendirme puanı boş bırakılamaz"),
  comment: yup
    .string()
    .max(200, "Yorum 200 karakterden uzun olamaz")
    .min(10, "Yorum 10 karakterden kısa olamaz")
    .required("Yorum boş bırakılamaz"),
});

interface BaseRatingFormValues {
  rating: number;
  comment: string;
}

// This component will be used for both rating teacher and university
const BaseRatingForm = forwardRef<FormikProps<BaseRatingFormValues>>(
  (props, ref) => {
    const rateContext = useContext(RateContext);

    const formik = useFormik<BaseRatingFormValues>({
      initialValues: {
        rating: rateContext.rating,
        comment: rateContext.comment,
      },
      validationSchema: BaseRatingFormValidationSchema,
      onSubmit: (values) => {
        rateContext.setRating(values.rating);
        rateContext.setComment(values.comment);
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
              Son olarak, senden genel olarak bir puan ve yorumunu istiyoruz.
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
          <TextareaInput name="comment" label="Yorum" rows={6} />
        </form>
      </FormikProvider>
    );
  }
);

BaseRatingForm.displayName = "BaseRatingForm";
export default BaseRatingForm;
