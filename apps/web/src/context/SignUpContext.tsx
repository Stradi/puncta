import { createContext, useState } from "react";

interface SignUpContextProps {
  email: string;
  setEmail: (email: string) => void;

  username: string;
  setUsername: (username: string) => void;

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
}

export const SignUpContext = createContext<SignUpContextProps>(
  {} as SignUpContextProps
);

export function SignUpProvider({ children }: React.PropsWithChildren<{}>) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
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

  return (
    <SignUpContext.Provider
      value={{
        email,
        setEmail,
        username,
        setUsername,
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
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
}
