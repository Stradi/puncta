"use client";

import { RateContext } from "@/context/RateContext";
import { FormikProps } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { createRef, useContext } from "react";
import Button from "../Button";
import BaseRatingForm from "./forms/BaseRatingForm";
import IntroScreen from "./forms/IntroScreen";

export default function RateForm(props: React.ComponentPropsWithoutRef<"div">) {
  const formRef = createRef<FormikProps<any>>();
  const rateContext = useContext(RateContext);

  return (
    <div className="py-8 px-2">
      <h1 className="mb-4 text-center text-3xl font-medium">Değerlendir</h1>
      <AnimatePresence>
        <motion.div
          key={rateContext.step}
          initial={{ opacity: 0, height: "0px" }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: "0px" }}
        >
          {rateContext.step === 0 && <IntroScreen />}
          {rateContext.step === 1 && <BaseRatingForm ref={formRef} />}
        </motion.div>
      </AnimatePresence>
      <div className="mt-8 flex justify-evenly">
        <Button
          variant="text"
          fullWidth
          onClick={() => {
            rateContext.prevStep();
          }}
          disabled={rateContext.step <= 0}
        >
          Geri Dön
        </Button>
        <Button
          fullWidth
          onClick={() => {
            if (rateContext.step === 0) {
              rateContext.nextStep();
            } else if (rateContext.step === 4) {
              console.log(rateContext.getPayload());
            } else {
              formRef.current?.submitForm();
            }
          }}
        >
          Devam Et
        </Button>
      </div>
    </div>
  );
}
