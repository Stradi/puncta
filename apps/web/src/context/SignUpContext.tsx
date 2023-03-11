import { createContext, useState } from "react";
import { RegisterPayload } from "./AuthContext";

interface SignUpContextProps {
  registrationType: "TEACHER" | "STUDENT";
  setRegistrationType: (registrationType: "TEACHER" | "STUDENT") => void;

  email: string;
  setEmail: (email: string) => void;

  username: string;
  setUsername: (username: string) => void;

  password: string;
  setPassword: (password: string) => void;

  university: string;
  setUniversity: (university: string) => void;

  faculty: string;
  setFaculty: (faculty: string) => void;

  step: number;
  setStep: (step: number) => void;
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      username,
      password,
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
        username,
        setUsername,
        password,
        setPassword,
        university,
        setUniversity,
        faculty,
        setFaculty,
        step,
        setStep,
        nextStep,
        prevStep,
        getPayload,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
}
