"use client";

import { createContext, useState } from "react";

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

type Criteria = {
  name: string;
  score: number;
};

interface RateContextProps {
  rating: number;
  setRating: (rating: number) => void;

  criterias: Criteria[];
  addOrUpdateCriteria: (criteria: Criteria) => void;

  step: number;
  prevStep: () => void;
  nextStep: () => void;
  getPayload: () => any;

  ratingTo: ConditionalRateTo;
}

export const RateContext = createContext<RateContextProps>(
  {} as RateContextProps
);

type RateProviderProps = React.PropsWithChildren & ConditionalRateTo;

export function RateProvider(props: RateProviderProps) {
  const [rating, setRating] = useState(0);
  const [criterias, setCriterias] = useState<Criteria[]>([]);

  const [step, setStep] = useState(0);

  function addOrUpdateCriteria(criteria: Criteria) {
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
    };
  }

  return (
    <RateContext.Provider
      value={{
        rating,
        setRating,
        criterias,
        addOrUpdateCriteria,
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
