import { RateContext } from "@/context/RateContext";
import { FormikProps } from "formik";
import { forwardRef, useContext } from "react";
import RateInput from "../../RateInput";

import BaseMultistepForm from "@/components/BaseMultistepForm";
import * as yup from "yup";

const SecondTeacherFormValidationSchema = yup.object().shape({
  difficulty: yup.number().min(1, "Zorluk düzeyi boş bırakılamaz."),
  politicness: yup.number().min(1, "Politiklik düzeyi boş bırakılamaz."),
  fairness: yup.number().min(1, "Adillik düzeyi boş bırakılamaz."),
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
        difficulty:
          rateContext.criterias.find((c) => c.name === "difficulty")?.score ||
          0,
        politicness:
          rateContext.criterias.find((c) => c.name === "politicness")?.score ||
          0,
        fairness:
          rateContext.criterias.find((c) => c.name === "fairness")?.score || 0,
      }}
      validationSchema={SecondTeacherFormValidationSchema}
      onSubmit={(values) => {
        rateContext.addOrUpdateCriteria({
          name: "difficulty",
          localizedName: "Zorluk",
          score: values.difficulty,
          affectsGrade: false,
        });

        rateContext.addOrUpdateCriteria({
          name: "politicness",
          localizedName: "Politiklik",
          score: values.politicness,
          affectsGrade: false,
        });

        rateContext.addOrUpdateCriteria({
          name: "fairness",
          localizedName: "Adillik",
          score: values.fairness,
          affectsGrade: false,
        });

        rateContext.nextStep();
      }}
    >
      <div>
        <p className="text-lg">
          Burada da öğretmeninin hakkındaki görüşlerinizi belirtmeni istiyoruz.
        </p>
      </div>
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
        name="politicness"
        label="Politiklik"
        info="Kişinin siyasi ve ideolojik tavır ve baskınlık düzeyi."
        steps={[
          {
            text: "Apolitik",
            value: 1,
          },
          {
            text: "Bazen",
            value: 2,
          },
          {
            text: "Dengeli",
            value: 3,
          },
          {
            text: "Politik",
            value: 4,
          },
          {
            text: "Aşırı Politik",
            value: 5,
          },
        ]}
      />
      <RateInput
        name="fairness"
        label="Adillik"
        info="Kişinin herkese eşit mesafede olduğunu, ayrım yapmadan adil olma düzeyi."
        steps={[
          {
            text: "Ayrımcı",
            value: 1,
          },
          {
            text: "Yetersiz",
            value: 2,
          },
          {
            text: "Dengeli",
            value: 3,
          },
          {
            text: "Yeterli",
            value: 4,
          },
          {
            text: "Adil",
            value: 5,
          },
        ]}
      />
    </BaseMultistepForm>
  );
});
