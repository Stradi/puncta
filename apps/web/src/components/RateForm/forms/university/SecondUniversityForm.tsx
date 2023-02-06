import { RateContext } from "@/context/RateContext";
import { FormikProps } from "formik";
import { forwardRef, useContext } from "react";
import RateInput from "../../RateInput";

import BaseMultistepForm from "@/components/BaseMultistepForm";
import * as yup from "yup";

const SecondUniversityFormValidationSchema = yup.object().shape({
  sociability: yup.number().min(1, "Sosyallik kısmı boş bırakılamaz"),
  meals: yup.number().min(1, "Yemekler kısmı boş bırakılamaz"),
  campus: yup.number().min(1, "Kampüs kısmı boş bırakılamaz"),
});

export default forwardRef<FormikProps<any>>(function SecondUniversityForm(
  props,
  ref
) {
  const rateContext = useContext(RateContext);

  return (
    <BaseMultistepForm
      ref={ref}
      initialValues={{
        sociability:
          rateContext.criterias.find((c) => c.name === "sociability")?.score ||
          0,
        meals:
          rateContext.criterias.find((c) => c.name === "meals")?.score || 0,
        campus:
          rateContext.criterias.find((c) => c.name === "campus")?.score || 0,
      }}
      validationSchema={SecondUniversityFormValidationSchema}
      onSubmit={(values) => {
        rateContext.addOrUpdateCriteria({
          name: "sociability",
          localizedName: "Sosyallik",
          score: values.sociability * 2,
          affectsGrade: true,
        });

        rateContext.addOrUpdateCriteria({
          name: "meals",
          localizedName: "Yemekler",
          score: values.meals * 2,
          affectsGrade: true,
        });

        rateContext.addOrUpdateCriteria({
          name: "campus",
          localizedName: "Kampüs",
          score: values.campus * 2,
          affectsGrade: true,
        });

        rateContext.nextStep();
      }}
    >
      <div>
        <p className="text-lg">
          Burada da üniversitenin biraz daha öğrenciye yönelik olan
          özelliklerini değerlendirmeni istiyoruz.
        </p>
      </div>
      <RateInput
        name="sociability"
        label="Sosyallik"
        info="Öğrencilerin sosyal hayatı, sosyal aktiviteler, kulüpler, etkinlikler."
        steps={[
          {
            text: "Yetersiz",
            value: 1,
          },
          {
            text: "Az",
            value: 2,
          },
          {
            text: "Orta",
            value: 3,
          },
          {
            text: "İyi",
            value: 4,
          },
          {
            text: "Çok iyi",
            value: 5,
          },
        ]}
      />
      <RateInput
        name="meals"
        label="Yemekler"
        info="Yemekhanede veya kantinde sunulan yemeklerin kalitesi, çeşitliliği."
        steps={[
          {
            text: "Yetersiz",
            value: 1,
          },
          {
            text: "Az",
            value: 2,
          },
          {
            text: "Orta",
            value: 3,
          },
          {
            text: "İyi",
            value: 4,
          },
          {
            text: "Çok iyi",
            value: 5,
          },
        ]}
      />
      <RateInput
        name="campus"
        label="Kampüs"
        info="Kampüsün genel görünümü, temizliği, bakımı, güvenliği."
        steps={[
          {
            text: "Yetersiz",
            value: 1,
          },
          {
            text: "Az",
            value: 2,
          },
          {
            text: "Orta",
            value: 3,
          },
          {
            text: "İyi",
            value: 4,
          },
          {
            text: "Çok iyi",
            value: 5,
          },
        ]}
      />
    </BaseMultistepForm>
  );
});
