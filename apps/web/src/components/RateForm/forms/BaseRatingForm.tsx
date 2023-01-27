import BaseMultistepForm from "@/components/BaseMultistepForm";
import TextareaInput from "@/components/TextareaInput";
import { RateContext } from "@/context/RateContext";
import { FormikProps } from "formik";
import { forwardRef, useContext } from "react";

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

export default forwardRef<FormikProps<any>>(function BaseRatingForm(
  props,
  ref
) {
  const rateContext = useContext(RateContext);

  return (
    <BaseMultistepForm
      ref={ref}
      initialValues={{
        rating: rateContext.rating,
        comment: rateContext.comment,
      }}
      validationSchema={BaseRatingFormValidationSchema}
      onSubmit={(values) => {
        rateContext.setRating(values.rating);
        rateContext.setComment(values.comment);
        rateContext.nextStep();
      }}
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
    </BaseMultistepForm>
  );
});
