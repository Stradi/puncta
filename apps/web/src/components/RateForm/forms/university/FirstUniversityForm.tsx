import { RateContext } from "@/context/RateContext";
import { cn } from "@/lib/utils";
import { FormikProps, FormikProvider, useFormik } from "formik";
import { forwardRef, useContext, useImperativeHandle } from "react";
import RateInput from "../../RateInput";

import * as yup from "yup";

const FirstUniversityFormValidationSchema = yup.object().shape({
  infrastructure: yup.number().min(1, "Altyapı düzeyi kısmı boş bırakılamaz"),
  facilities: yup.number().min(1, "İmkanlar kısmı boş bırakılamaz"),
  security: yup.number().min(1, "Güvenlik kısmı boş bırakılamaz"),
});

interface FirstUniversityFormValues {
  infrastructure: number;
  facilities: number;
  security: number;
}

const FirstUniversityForm = forwardRef<FormikProps<FirstUniversityFormValues>>(
  (props, ref) => {
    const rateContext = useContext(RateContext);

    const formik = useFormik<FirstUniversityFormValues>({
      initialValues: {
        infrastructure:
          rateContext.criterias.find((c) => c.name === "infrastructure")
            ?.score || 0,
        facilities:
          rateContext.criterias.find((c) => c.name === "facilities")?.score ||
          0,
        security:
          rateContext.criterias.find((c) => c.name === "security")?.score || 0,
      },
      validationSchema: FirstUniversityFormValidationSchema,
      onSubmit: (values) => {
        rateContext.addOrUpdateCriteria({
          name: "infrastructure",
          localizedName: "Altyapı",
          score: values.infrastructure,
        });

        rateContext.addOrUpdateCriteria({
          name: "facilities",
          localizedName: "İmkanlar",
          score: values.facilities,
        });

        rateContext.addOrUpdateCriteria({
          name: "security",
          localizedName: "Güvenlik",
          score: values.security,
        });

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
              Burada üniversitenin altyapı, imkanlar ve güvenlik konularında
              nasıl düşündüğünüzü öğrenmek istiyoruz.
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
        </form>
      </FormikProvider>
    );
  }
);

FirstUniversityForm.displayName = "FirstUniversityForm";
export default FirstUniversityForm;
