import clsx, { ClassValue } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAverage(values: number[]) {
  return values.reduce((a, b) => a + b) / values.length;
}

export function numberToLetterGrade(score: number) {
  if (score >= 85) {
    return "A";
  } else if (score >= 75) {
    return "B";
  } else if (score >= 60) {
    return "C";
  } else if (score >= 50) {
    return "D";
  } else {
    return "F";
  }
}

export function ratingsToLetterGrade(ratings: Rating[] | undefined) {
  if (!ratings || ratings.length === 0) {
    return "N/A";
  }

  const average = calculateAverage(
    ratings.map((rating) => getAverageOfCriterias(getRatingMeta(rating)))
  );

  return numberToLetterGrade(average * 20);
}

export function toReadableDate(date: string) {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function joinReactChildren(
  children: React.ReactNode[],
  seperator: React.ReactNode
) {
  return children.reduce((prev, curr, idx) => {
    const keyedSeperator = Object.create({
      ...(seperator as React.ReactElement),
      key: `seperator-${idx}`,
    });
    return [prev, keyedSeperator, curr];
  });
}

export function ratingMetaToScoresArray(ratings: Rating[], max: number) {
  // rating.meta returns a RateCriteria object that has name and score properties
  // We should sum up the scores of each category and return an array of {
  //  category: string;
  //  value: number;
  //  max: number;
  //  info: string;
  // }

  const criterias = ratings.map((rating) => JSON.parse(rating.meta)) as [
    RateCriteria[]
  ];

  const criteriaNames = Array.from(
    new Set(
      criterias.flatMap((criteria) => criteria.map((c) => c.localizedName))
    )
  );

  return criteriaNames.map((name) => {
    const scores = criterias.flatMap((criteria) =>
      criteria.filter((c) => c.localizedName === name).map((c) => c.score)
    );

    return {
      category: name,
      value: calculateAverage(scores),
      max,
      info: `${name} kriteri için ${ratings.length} değerlendirme yapılmıştır.`,
    };
  });
}

// TODO: We probably only want RateCriteria.affectsGrade=true ones.
function getRatingMeta(rating: Rating) {
  return JSON.parse(rating.meta) as RateCriteria[];
}

function getAverageOfCriterias(criterias: RateCriteria[]) {
  return calculateAverage(criterias.map((criteria) => criteria.score));
}
