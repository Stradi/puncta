import { createRating } from "@/lib/rate";
import { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";

export interface CreateRatingPayload {
  rating: number;
  comment: string;
  criterias: RateCriteria[];

  ratingTo: ConditionalRateTo;
}

type ConditionalRateTo =
  | {
      type: "university";
      university: Required<Pick<University, "name" | "slug">>;
    }
  | {
      type: "teacher";
      university: Required<Pick<University, "name" | "slug">>;
      faculty: Required<Pick<Faculty, "name" | "slug">>;
      teacher: Required<Pick<Teacher, "name" | "slug">>;
    };

interface RateContextProps {
  rating: number;
  setRating: (rating: number) => void;

  comment: string;
  setComment: (comment: string) => void;

  criterias: RateCriteria[];
  addOrUpdateCriteria: (criteria: RateCriteria) => void;

  step: number;
  prevStep: () => void;
  nextStep: () => void;
  getPayload: () => CreateRatingPayload;

  rate: () => Promise<boolean>;

  ratingTo: ConditionalRateTo;
}

export const RateContext = createContext<RateContextProps>(
  {} as RateContextProps
);

type RateProviderProps = React.PropsWithChildren & ConditionalRateTo;

export function RateProvider(props: RateProviderProps) {
  const authContext = useContext(AuthContext);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [criterias, setCriterias] = useState<RateCriteria[]>([]);

  const [step, setStep] = useState(0);

  function addOrUpdateCriteria(criteria: RateCriteria) {
    setCriterias((prev) => {
      const index = prev.findIndex((c) => c.name === criteria.name);
      if (index === -1) {
        return [...prev, criteria];
      } else {
        return prev.map((c, i) => (i === index ? criteria : c));
      }
    });
  }

  function prevStep() {
    setStep((prev) => prev - 1);
  }

  function nextStep() {
    setStep((prev) => prev + 1);
  }

  function getPayload() {
    return {
      rating,
      comment,
      criterias,
      ratingTo: props,
    };
  }

  async function rate() {
    const response = await createRating(getPayload());
    if (!response) {
      return false;
    }

    authContext.addRatingToUser(response);
    return true;
  }

  return (
    <RateContext.Provider
      value={{
        rating,
        setRating,
        comment,
        setComment,
        criterias,
        addOrUpdateCriteria,
        rate,
        step,
        prevStep,
        nextStep,
        getPayload,
        ratingTo: props,
      }}
    >
      {props.children}
    </RateContext.Provider>
  );
}
