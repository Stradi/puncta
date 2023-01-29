import { RateContext } from "@/context/RateContext";
import { FormikProps } from "formik";
import { forwardRef, useContext } from "react";
import RateInput from "../../RateInput";

import BaseMultistepForm from "@/components/BaseMultistepForm";
import * as yup from "yup";

const SecondTeacherFormValidationSchema = yup.object().shape({
  technique: yup.number().min(1, "Yöntem düzeyi kısmı boş bırakılamaz"),
  material: yup.number().min(1, "Materyal kısmı boş bırakılamaz"),
  difficulty: yup.number().min(1, "Zorluk düzeyi kısmı boş bırakılamaz"),
});

export default forwardRef<FormikProps<any>>(function SecondTeacherForm(
  props,
  ref
) {
  const rateContext = useContext(RateContext);

  return (
    <BaseMultistepForm
      ref={ref}
      initialValues={{
        technique:
          rateContext.criterias.find((c) => c.name === "technique")?.score || 0,
        material:
          rateContext.criterias.find((c) => c.name === "material")?.score || 0,
        difficulty:
          rateContext.criterias.find((c) => c.name === "difficulty")?.score ||
          0,
      }}
      validationSchema={SecondTeacherFormValidationSchema}
      onSubmit={(values) => {
        rateContext.addOrUpdateCriteria({
          name: "technique",
          localizedName: "Yöntem",
          score: values.technique,
          affectsGrade: true,
        });

        rateContext.addOrUpdateCriteria({
          name: "material",
          localizedName: "Materyal",
          score: values.material,
          affectsGrade: true,
        });

        rateContext.addOrUpdateCriteria({
          name: "difficulty",
          localizedName: "Zorluk",
          score: values.difficulty,
          affectsGrade: true,
        });

        rateContext.nextStep();
      }}
    >
      <div>
        <p className="text-lg">
          Burada da öğretmeninin ders işleyişi hakkındaki görüşlerinizi
          belirtmeni istiyoruz.
        </p>
      </div>

      <RateInput
        name="technique"
        label="Yöntem"
        info="Kişinin eğitim sürecinde kullandığı yöntemler, teknikler ve ders işleyiş şekli."
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
        name="difficulty"
        label="Zorluk"
        info="Öğrencinin dersi alırken karşılaştığı zorluk düzeyi."
        steps={[
          {
            text: "Çok basit",
            value: 1,
          },
          {
            text: "Basit",
            value: 2,
          },
          {
            text: "Orta",
            value: 3,
          },
          {
            text: "Zor",
            value: 4,
          },
          {
            text: "Çok zor",
            value: 5,
          },
        ]}
      />
      <RateInput
        name="material"
        label="Materyal"
        info="Kişinin derslerde kullandığı kaynaklar, materyaller ve teknolojik yetkinliği."
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
