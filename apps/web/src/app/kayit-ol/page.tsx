"use client";

import Button from "@/components/Button";
import { Card } from "@/components/Card";
import { AuthContext } from "@/context/AuthContext";
import { SignUpContext } from "@/context/SignUpContext";
import { FormikProps } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { createRef, useContext } from "react";
import BasicInformationForm from "./forms/BasicInformationForm";
import FinalForm from "./forms/FinalForm";
import PasswordForm from "./forms/PasswordForm";
import UniversityForm from "./forms/UniversityForm";

export default function Page() {
  // Since we are not interested in return type of form, we can use any.
  const formRef = createRef<FormikProps<any>>();
  const signUpContext = useContext(SignUpContext);
  const authContext = useContext(AuthContext);

  return (
    <Card className="mx-auto mt-16 max-w-lg py-16 px-8">
      <h1 className="mb-4 text-center text-3xl font-medium">Kayıt Ol</h1>
      <AnimatePresence>
        <motion.div
          key={signUpContext.step}
          initial={{ opacity: 0, height: "0px" }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: "0px" }}
        >
          {signUpContext.step === 0 && <BasicInformationForm ref={formRef} />}
          {signUpContext.step === 1 && <PasswordForm ref={formRef} />}
          {signUpContext.step === 2 && <UniversityForm ref={formRef} />}
          {signUpContext.step === 3 && <FinalForm />}
        </motion.div>
      </AnimatePresence>
      <div className="mt-8 flex justify-evenly">
        <Button
          variant="text"
          fullWidth
          onClick={() => {
            signUpContext.prevStep();
          }}
          disabled={signUpContext.step <= 0}
        >
          Geri Dön
        </Button>
        <Button
          fullWidth
          onClick={() => {
            if (signUpContext.step === 3) {
              authContext.register(signUpContext.getPayload());
            } else {
              formRef.current?.submitForm();
            }
          }}
        >
          {signUpContext.step === 3 ? "Kayıt Ol" : "Devam Et"}
        </Button>
      </div>
    </Card>
  );
}
