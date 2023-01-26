import { RateContext } from "@/context/RateContext";
import { cn } from "@/lib/utils";
import { FormikProps, FormikProvider, useFormik } from "formik";
import { forwardRef, useContext, useImperativeHandle } from "react";
import RateInput from "../../RateInput";

import * as yup from "yup";

const FirstTeacherFormValidationSchema = yup.object().shape({
  knowledge: yup.number().min(1, "Bilgi düzeyi kısmı boş bırakılamaz"),
  communication: yup.number().min(1, "İletişim kısmı boş bırakılamaz"),
  fairness: yup.number().min(1, "Adillik kısmı boş bırakılamaz"),
});

interface FirstTeacherFormValues {
  knowledge: number;
  communication: number;
  fairness: number;
}

const FirstTeacherForm = forwardRef<FormikProps<FirstTeacherFormValues>>(
  (props, ref) => {
    const rateContext = useContext(RateContext);

    const formik = useFormik<FirstTeacherFormValues>({
      initialValues: {
        knowledge:
          rateContext.criterias.find((c) => c.name === "knowledge")?.score || 0,
        communication:
          rateContext.criterias.find((c) => c.name === "communication")
            ?.score || 0,
        fairness:
          rateContext.criterias.find((c) => c.name === "fairness")?.score || 0,
      },
      validationSchema: FirstTeacherFormValidationSchema,
      onSubmit: (values) => {
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
        </form>
      </FormikProvider>
    );
  }
);

FirstTeacherForm.displayName = "FirstTeacherForm";
export default FirstTeacherForm;
