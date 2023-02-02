import { createContext, useState } from "react";
import { RegisterPayload } from "./AuthContext";

interface SignUpContextProps {
  registrationType: "TEACHER" | "STUDENT";
  setRegistrationType: (registrationType: "TEACHER" | "STUDENT") => void;

  email: string;
  setEmail: (email: string) => void;

  password: string;
  setPassword: (password: string) => void;

  firstName: string;
  setFirstName: (firstName: string) => void;

  lastName: string;
  setLastName: (lastName: string) => void;

  university: string;
  setUniversity: (university: string) => void;

  faculty: string;
  setFaculty: (faculty: string) => void;

  step: number;
  nextStep: () => void;
  prevStep: () => void;

  getPayload: () => RegisterPayload;
}

export const SignUpContext = createContext<SignUpContextProps>(
  {} as SignUpContextProps
);

export function SignUpProvider({ children }: React.PropsWithChildren<{}>) {
  const [registrationType, setRegistrationType] = useState<
    "STUDENT" | "TEACHER"
  >("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [university, setUniversity] = useState("");
  const [faculty, setFaculty] = useState("");

  const [step, setStep] = useState(0);

  function nextStep() {
    setStep(step + 1);
  }

  function prevStep() {
    if (step > 0) {
      setStep(step - 1);
    }
  }

  function getPayload() {
    return {
      type: registrationType,
      email,
      password,
      firstName,
      lastName,
      university,
      faculty,
    };
  }

  return (
    <SignUpContext.Provider
      value={{
        registrationType,
        setRegistrationType,
        email,
        setEmail,
        password,
        setPassword,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        university,
        setUniversity,
        faculty,
        setFaculty,
        step,
        nextStep,
        prevStep,
        getPayload,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
}
