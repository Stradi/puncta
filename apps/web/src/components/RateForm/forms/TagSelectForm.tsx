import BaseMultistepForm from "@/components/BaseMultistepForm";
import { RateContext } from "@/context/RateContext";
import { FormikProps } from "formik";
import { forwardRef, useContext } from "react";

import * as yup from "yup";
import TagCloudInput from "../TagCloudInput";

const TagSelectFormValidationSchema = yup.object().shape({
  tags: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required(),
        localizedName: yup.string().required(),
      })
    )
    .min(2, "En az üç etiket seçmelisin."),
});

interface TagSelectFormProps {
  tags: RateTag[];
}

export default forwardRef<FormikProps<any>, TagSelectFormProps>(
  function TagSelectForm(props, ref) {
    const rateContext = useContext(RateContext);

    return (
      <BaseMultistepForm
        ref={ref}
        initialValues={{
          tags: rateContext.tags,
        }}
        validationSchema={TagSelectFormValidationSchema}
        onSubmit={(values) => {
          rateContext.setTags(values.tags);
          rateContext.nextStep();
        }}
      >
        <div>
          <p className="text-lg">
            Burada da etiketlerini seçebilirsin. En çok eklenen etiketler
            öğretmenin veya üniversitenin sayfasında görünecektir.
          </p>
        </div>
        <TagCloudInput name="tags" label="Etiketler" tags={props.tags} />
      </BaseMultistepForm>
    );
  }
);
