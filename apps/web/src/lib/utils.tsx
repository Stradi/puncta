import clsx, { ClassValue } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAverage(values: number[]) {
  return values.reduce((a, b) => a + b, 0) / values.length;
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

  return numberToLetterGrade(average * 10);
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

  const criterias = ratings.map((rating) => getRatingMeta(rating));
  const criteriaNames = Array.from(
    new Set(
      criterias.flatMap((criteria) => criteria.map((c) => c.localizedName))
    )
  );

  return criteriaNames.map((name) => {
    const scores = criterias.flatMap((criteria) =>
      criteria
        .filter((c) => c.localizedName === name && c.affectsGrade)
        .map((c) => c.score)
    );

    return {
      category: name,
      value: calculateAverage(scores),
      max,
      info: `${name} kriteri için ${ratings.length} değerlendirme yapılmıştır.`,
    };
  });
}

export function getRatingMeta(rating: Rating) {
  return getOnlyAffectingCriterias(
    (JSON.parse(rating.meta) as RateMeta).criterias
  );
}

export function getRatingTags(rating: Rating) {
  return (JSON.parse(rating.meta) as RateMeta).tags;
}

export function mostFrequentTags(ratings: Rating[], count: number) {
  const tags = ratings.flatMap((rating) => getRatingTags(rating));
  const tagCount = tags.reduce((acc, tag) => {
    if (acc[tag.name]) {
      acc[tag.name] += 1;
    } else {
      acc[tag.name] = 1;
    }

    return acc;
  }, {} as Record<string, number>);

  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map((entry) => tags.find((tag) => tag.name === entry[0]));
}

function getAverageOfCriterias(criterias: RateCriteria[]) {
  return calculateAverage(criterias.map((criteria) => criteria.score));
}

function getOnlyAffectingCriterias(criterias: RateCriteria[]) {
  return criterias.filter((criteria) => criteria.affectsGrade);
}

export function parseQuery<T, U extends keyof T>(
  query: T,
  keys: U[]
): Pick<T, U> {
  const returnValue = {} as Pick<T, U>;
  keys.forEach((key) => {
    returnValue[key] = query[key];
  });

  return returnValue;
}

export function safeLogicalOr(a: any, defaultValue: any) {
  if (typeof a === "undefined") {
    return defaultValue;
  }

  return a;
}

import { NextApiRequest, NextApiResponse } from "next";

type HandlerObject = {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
};

export function apiHandler(handler: HandlerObject) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method as string;
    if (!handler[method]) {
      return res.status(405).end(`Method ${req.method} not allowed`);
    }

    try {
      await handler[method](req, res);
    } catch (e: unknown) {
      errorHandler(e, req, res);
    }
  };
}

const errorHandler = (
  err: unknown,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  return res.status(500).json({ error: err });
};
