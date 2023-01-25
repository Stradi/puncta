"use client";

import Button from "@/components/Button";
import { AuthContext } from "@/context/AuthContext";
import { ModalContext } from "@/context/ModalContext";
import { RateContext, RateProvider } from "@/context/RateContext";
import { useContext } from "react";
import RateForm from "./RateForm";

export default function AuthCardFooter() {
  const rateContext = useContext(RateContext);
  const authContext = useContext(AuthContext);
  const modalContext = useContext(ModalContext);

  console.log(rateContext);

  if (!authContext.isAuthenticated) {
    return <></>;
  }

  let canRate = false;

  // To rate university, we should only check if user
  // is in the same university as the university we are
  // rating.
  if (
    rateContext.ratingTo.type === "university" &&
    authContext.user?.university?.slug === rateContext.ratingTo.university.slug
  ) {
    canRate = true;
  }

  // To rate teacher, we should check if user is in the
  // same university and faculty as the teacher we are
  // rating.
  if (
    rateContext.ratingTo.type === "teacher" &&
    authContext.user?.university?.slug ===
      rateContext.ratingTo.university.slug &&
    authContext.user?.faculty?.slug === rateContext.ratingTo.faculty.slug
  ) {
    canRate = true;
  }

  if (!canRate) {
    return <></>;
  }

  return (
    <div className="space-y-2 p-4 font-medium">
      {rateContext.ratingTo.type === "university" && (
        <p>
          Görünüşe göre bu üniversiteyi okuyorsunuz. Bu üniversite hakkında ne
          düşünüyorsunuz?
        </p>
      )}
      {rateContext.ratingTo.type === "teacher" && (
        <p>
          Görünüşe göre bu öğretmen senin öğretmenin. Bu öğretmen hakkında ne
          düşünüyorsunuz?
        </p>
      )}

      <Button
        fullWidth
        onClick={() => {
          modalContext.setContent(
            // Since we don't need to preserve the state of RateContext in
            // in RateForm, we can pass another RateContext to RateForm.
            // Think this is as Context Drilling (new term created by me).
            <RateProvider {...rateContext.ratingTo}>
              <RateForm />
            </RateProvider>
          );
          modalContext.setIsOpen(true);
        }}
      >
        Değerlendir
      </Button>
    </div>
  );
}
