import { RateContext } from "@/context/RateContext";
import { FormikProps } from "formik";
import { forwardRef, useContext } from "react";
import RateInput from "../../RateInput";

import BaseMultistepForm from "@/components/BaseMultistepForm";
import * as yup from "yup";

const FirstUniversityFormValidationSchema = yup.object().shape({
  infrastructure: yup.number().min(1, "Altyapı düzeyi kısmı boş bırakılamaz"),
  facilities: yup.number().min(1, "İmkanlar kısmı boş bırakılamaz"),
  security: yup.number().min(1, "Güvenlik kısmı boş bırakılamaz"),
});

export default forwardRef<FormikProps<any>>(function FirstUniversityForm(
  props,
  ref
) {
  const rateContext = useContext(RateContext);

  return (
    <BaseMultistepForm
      ref={ref}
      initialValues={{
        infrastructure:
          rateContext.criterias.find((c) => c.name === "infrastructure")
            ?.score || 0,
        facilities:
          rateContext.criterias.find((c) => c.name === "facilities")?.score ||
          0,
        security:
          rateContext.criterias.find((c) => c.name === "security")?.score || 0,
      }}
      validationSchema={FirstUniversityFormValidationSchema}
      onSubmit={(values) => {
        rateContext.addOrUpdateCriteria({
          name: "infrastructure",
          localizedName: "Altyapı",
          score: values.infrastructure * 2,
          affectsGrade: true,
        });

        rateContext.addOrUpdateCriteria({
          name: "facilities",
          localizedName: "İmkanlar",
          score: values.facilities * 2,
          affectsGrade: true,
        });

        rateContext.addOrUpdateCriteria({
          name: "security",
          localizedName: "Güvenlik",
          score: values.security * 2,
          affectsGrade: true,
        });

        rateContext.nextStep();
      }}
    >
      <div>
        <p className="text-lg">
          Burada üniversitenin altyapı, imkanlar ve güvenlik konularında nasıl
          düşündüğünüzü öğrenmek istiyoruz.
        </p>
      </div>
      <RateInput
        name="infrastructure"
        label="Altyapı"
        info="Kurumun yaz ve kış şartlarına uygun olarak aldığı aksiyonlar, internet ve teknoloji desteği."
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
        name="facilities"
        label="İmkanlar"
        info="Öğrenciye sağlanan ayrıcalıklar, indirimler, yardımlar veya staj potansiyeli."
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
        name="security"
        label="Güvenlik"
        info="Kurumun genel güvenliği, güvenlik ekibi ve güvenlik protokolleri."
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
