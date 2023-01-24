"use client";

import Button from "@/components/Button";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

type ConditionalProps =
  | {
      type: "university";
      slug: string;
    }
  | {
      type: "teacher";
      universitySlug: string;
      facultySlug: string;
    };

type AuthCardFooterProps = ConditionalProps;

export default function AuthCardFooter(props: AuthCardFooterProps) {
  const authContext = useContext(AuthContext);
  console.log(props, authContext.user);
  if (!authContext.isAuthenticated) {
    return <></>;
  }

  let canRate = false;

  // To rate university, we should only check if user
  // is in the same university as the university we are
  // rating.
  if (
    props.type === "university" &&
    authContext.user?.university?.slug === props.slug
  ) {
    canRate = true;
  }

  // To rate teacher, we should check if user is in the
  // same university and faculty as the teacher we are
  // rating.
  if (
    props.type === "teacher" &&
    authContext.user?.university?.slug === props.universitySlug &&
    authContext.user?.faculty?.slug === props.facultySlug
  ) {
    canRate = true;
  }

  if (!canRate) {
    return <></>;
  }

  return (
    <div className="space-y-2 p-4 font-medium">
      {props.type === "university" && (
        <p>
          Görünüşe göre bu üniversiteyi okuyorsunuz. Bu üniversite hakkında ne
          düşünüyorsunuz?
        </p>
      )}
      {props.type === "teacher" && (
        <p>
          Görünüşe göre bu öğretmen senin öğretmenin. Bu öğretmen hakkında ne
          düşünüyorsunuz?
        </p>
      )}

      <Button fullWidth>Değerlendir</Button>
    </div>
  );
}
