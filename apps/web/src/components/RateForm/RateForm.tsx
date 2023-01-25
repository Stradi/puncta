"use client";

import { RateContext } from "@/context/RateContext";
import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import Button from "../Button";

export default function RateForm(props: React.ComponentPropsWithoutRef<"div">) {
  const rateContext = useContext(RateContext);

  return (
    <div>
      <h1 className="text-center text-3xl font-medium">Rate Form</h1>
      <p>
        You are rating{" "}
        {rateContext.ratingTo.type === "university"
          ? `an university called ${rateContext.ratingTo.university.name}`
          : `a teacher called ${rateContext.ratingTo.teacher.name} with department of ${rateContext.ratingTo.faculty.name} in ${rateContext.ratingTo.university.name}`}
      </p>
      <div>
        <AnimatePresence>
          <motion.div
            key={rateContext.step}
            initial={{ opacity: 0, height: "0px" }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: "0px" }}
          >
            {rateContext.step === 0 && <h1>Step 1</h1>}
            {rateContext.step === 1 && <h1>Step 2</h1>}
          </motion.div>
        </AnimatePresence>
      </div>
      <Button
        onClick={() => {
          rateContext.nextStep();
        }}
      >
        Next
      </Button>
    </div>
  );
}
