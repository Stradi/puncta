import { RateContext } from "@/context/RateContext";
import { FormikProps } from "formik";
import { forwardRef, useContext } from "react";
import RateInput from "../../RateInput";

import BaseMultistepForm from "@/components/BaseMultistepForm";
import * as yup from "yup";

const FirstTeacherFormValidationSchema = yup.object().shape({
  knowledge: yup.number().min(1, "Bilgi düzeyi kısmı boş bırakılamaz"),
  communication: yup.number().min(1, "İletişim kısmı boş bırakılamaz"),
  fairness: yup.number().min(1, "Adillik kısmı boş bırakılamaz"),
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
        knowledge:
          rateContext.criterias.find((c) => c.name === "knowledge")?.score || 0,
        communication:
          rateContext.criterias.find((c) => c.name === "communication")
            ?.score || 0,
        fairness:
          rateContext.criterias.find((c) => c.name === "fairness")?.score || 0,
      }}
      validationSchema={FirstTeacherFormValidationSchema}
      onSubmit={(values) => {
        rateContext.addOrUpdateCriteria({
          name: "knowledge",
          localizedName: "Bilgi",
          score: values.knowledge,
        });

        rateContext.addOrUpdateCriteria({
          name: "communication",
          localizedName: "İletişim",
          score: values.communication,
        });

        rateContext.addOrUpdateCriteria({
          name: "fairness",
          localizedName: "Tarafsızlık",
          score: values.fairness,
        });

        rateContext.nextStep();
      }}
    >
      <div>
        <p className="text-lg">
          Burada öğretmenini beş farklı kriter üzerinden değerlendirmeni
          istiyoruz.
        </p>
      </div>
      <RateInput
        name="knowledge"
        label="Bilgi Düzeyi"
        info="Kişinin bilgi düzeyi ve ilgili konu hakkındaki yetkinliği."
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
        name="communication"
        label="İletişim"
        info="Kişinin iletişim becerisi ve öğrenciye karşı yaklaşımı."
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
        name="fairness"
        label="Adillik"
        info="Kişinin herkese eşit mesafede olduğunu, ayrım yapmadan adil düzeyde davranması."
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
