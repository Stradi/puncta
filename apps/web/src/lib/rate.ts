import { CreateRatingPayload } from "@/context/RateContext";
import { gql } from "@apollo/client";
import { initializeApollo } from "./apollo";

const NEW_RATING_MUTATION = gql`
  mutation NewRating(
    $score: Int!
    $comment: String
    $meta: String
    $university: ConnectRatingUniversity
    $teacher: ConnectRatingTeacher
  ) {
    createRating(
      score: $score
      comment: $comment
      meta: $meta
      university: $university
      teacher: $teacher
    ) {
      id
      createdAt
      updatedAt
      score
      comment
      meta
      university {
        id
        name
        slug
      }
      teacher {
        id
        name
        slug
      }
    }
  }
`;

const RATEABLE_UNIVERSITY_QUERY = gql`
  query RateableUniversities {
    me {
      university {
        id
        name
        slug
        ratings {
          id
          score
          meta
        }
      }
      faculty {
        id
        name
        slug
      }
    }
  }
`;

const RATEABLE_TEACHERS_QUERY = gql`
  query RateableTeachers($universitySlug: String!, $facultySlug: String) {
    teacher(
      filter: {
        university: { slug: { equals: $universitySlug } }
        faculty: { slug: { equals: $facultySlug } }
      }
      pageSize: 26
    ) {
      id
      name
      slug
      ratings {
        id
        score
        meta
      }
    }
  }
`;

export async function createRating(payload: CreateRatingPayload) {
  const apolloClient = initializeApollo();

  const ratingToObj = {} as any;

  if (payload.ratingTo.type === "university") {
    ratingToObj.university = {
      slug: payload.ratingTo.university.slug,
    };
  } else {
    ratingToObj.teacher = {
      slug: payload.ratingTo.teacher.slug,
    };
  }

  const accessToken = localStorage.getItem("accessToken");

  const response = await apolloClient.mutate({
    mutation: NEW_RATING_MUTATION,
    variables: {
      score: payload.rating,
      comment: payload.comment,
      meta: JSON.stringify({
        criterias: payload.criterias,
        tags: payload.tags,
      }),
      ...ratingToObj,
    },
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  if (response.errors && response.errors.length > 0) {
    return null;
  }

  if (!response.data || !response.data.createRating) {
    return null;
  }

  const rating = response.data.createRating;
  return rating;
}

export async function getAllRateableEntities() {
  const apolloClient = initializeApollo();
  const accessToken = localStorage.getItem("accessToken");

  const rateableUniversity = await apolloClient.query({
    query: RATEABLE_UNIVERSITY_QUERY,
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  const rateableTeachers = await apolloClient.query<{
    teacher: Teacher[];
  }>({
    query: RATEABLE_TEACHERS_QUERY,
    variables: {
      universitySlug: rateableUniversity.data.me.university.slug,
      facultySlug: rateableUniversity.data.me.faculty.slug,
    },
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  return {
    university: rateableUniversity.data.me.university,
    teachers: rateableTeachers.data.teacher.filter(
      (t) => t.university !== null && t.faculty !== null
    ),
  };
}
