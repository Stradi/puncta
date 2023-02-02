import { SignUpContext } from "@/context/SignUpContext";
import { useContext, useEffect, useState } from "react";
import SelectableCard from "../SelectableCard";

export default function RegistrationTypeForm() {
  const [type, setType] = useState<"TEACHER" | "STUDENT">("STUDENT");
  const signUpContext = useContext(SignUpContext);

  useEffect(() => {
    setType(signUpContext.registrationType);
  }, [signUpContext.registrationType]);

  const onCardClick = (type: "TEACHER" | "STUDENT") => {
    setType(type);
    signUpContext.setRegistrationType(type);
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-medium">Öğretmen misin, öğrenci mi?</h2>
      <div className="flex gap-8">
        <SelectableCard
          onClick={() => onCardClick("STUDENT")}
          selected={type === "STUDENT"}
        >
          Öğrenci
        </SelectableCard>
        <SelectableCard
          onClick={() => onCardClick("TEACHER")}
          selected={type === "TEACHER"}
        >
          Öğretmen
        </SelectableCard>
      </div>
    </div>
  );
}
