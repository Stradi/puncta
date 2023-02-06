import { RateContext } from "@/context/RateContext";
import { FormikProps } from "formik";
import { forwardRef, useContext } from "react";

import BaseMultistepForm from "@/components/BaseMultistepForm";
import { safeLogicalOr } from "@/lib/utils";
import * as yup from "yup";
import RateSlider from "../../RateSlider";

const FirstTeacherFormValidationSchema = yup.object().shape({
  knowledge: yup.number(),
  technique: yup.number(),
  communication: yup.number(),
  material: yup.number(),
  declamation: yup.number(),
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
        knowledge: safeLogicalOr(
          rateContext.criterias.find((c) => c.name === "knowledge")?.score,
          5
        ),
        technique: safeLogicalOr(
          rateContext.criterias.find((c) => c.name === "technique")?.score,
          5
        ),
        communication: safeLogicalOr(
          rateContext.criterias.find((c) => c.name === "communication")?.score,
          5
        ),
        material: safeLogicalOr(
          rateContext.criterias.find((c) => c.name === "material")?.score,
          5
        ),
        declamation: safeLogicalOr(
          rateContext.criterias.find((c) => c.name === "declamation")?.score,
          5
        ),
      }}
      validationSchema={FirstTeacherFormValidationSchema}
      onSubmit={(values) => {
        rateContext.addOrUpdateCriteria({
          name: "knowledge",
          localizedName: "Bilgi",
          score: values.knowledge,
          affectsGrade: true,
        });

        rateContext.addOrUpdateCriteria({
          name: "technique",
          localizedName: "Yöntem",
          score: values.technique,
          affectsGrade: true,
        });

        rateContext.addOrUpdateCriteria({
          name: "communication",
          localizedName: "İletişim",
          score: values.communication,
          affectsGrade: true,
        });

        rateContext.addOrUpdateCriteria({
          name: "material",
          localizedName: "Materyal",
          score: values.material,
          affectsGrade: true,
        });

        rateContext.addOrUpdateCriteria({
          name: "declamation",
          localizedName: "Hitabet",
          score: values.declamation,
          affectsGrade: true,
        });

        rateContext.nextStep();
      }}
    >
      <div>
        <p className="text-lg">
          Burada öğretmeninin ders verme konusunda 5 faktörü
          değerlendireceksiniz.
        </p>
      </div>
      <RateSlider
        name="knowledge"
        label="Bilgi"
        max={10}
        min={0}
        step={1}
        valueToText={{
          0: "0",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
        }}
      />
      <RateSlider
        name="technique"
        label="Yöntem"
        max={10}
        min={0}
        step={1}
        valueToText={{
          0: "0",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
        }}
      />
      <RateSlider
        name="communication"
        label="İletişim"
        max={10}
        min={0}
        step={1}
        valueToText={{
          0: "0",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
        }}
      />
      <RateSlider
        name="material"
        label="Materyal"
        max={10}
        min={0}
        step={1}
        valueToText={{
          0: "0",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
        }}
      />
      <RateSlider
        name="declamation"
        label="Hitabet"
        max={10}
        min={0}
        step={1}
        valueToText={{
          0: "0",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
        }}
      />
    </BaseMultistepForm>
  );
});
