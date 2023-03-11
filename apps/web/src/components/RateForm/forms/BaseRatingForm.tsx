import BaseMultistepForm from "@/components/BaseMultistepForm";
import TextareaInput from "@/components/TextareaInput";
import { RateContext } from "@/context/RateContext";
import { FormikProps } from "formik";
import { forwardRef, useContext } from "react";

import * as yup from "yup";

const BaseRatingFormValidationSchema = yup.object().shape({
  rating: yup.number().min(1, "Genel değerlendirme puanı boş bırakılamaz"),
  comment: yup
    .string()
    .max(600, "Yorum 600 karakterden uzun olamaz")
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
        comment: rateContext.comment,
      }}
      validationSchema={BaseRatingFormValidationSchema}
      onSubmit={(values) => {
        rateContext.setComment(values.comment);
        rateContext.nextStep();
      }}
    >
      <div>
        <p className="text-lg">Son olarak, senden yorumunu istiyoruz.</p>
      </div>
      <TextareaInput name="comment" label="Yorum" rows={6} />
    </BaseMultistepForm>
  );
});
