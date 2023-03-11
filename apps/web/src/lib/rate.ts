import { CreateRatingPayload } from "@/context/RateContext";
import { gql } from "@apollo/client";
import { initializeApollo } from "./apollo";

const NEW_RATING_MUTATION = gql`
  mutation NewRating(
    $comment: String
    $meta: String
    $university: ConnectRatingUniversity
    $teacher: ConnectRatingTeacher
  ) {
    createRating(
      comment: $comment
      meta: $meta
      university: $university
      teacher: $teacher
    ) {
      id
      createdAt
      updatedAt
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

const UPDATE_RATING_MUTATION = gql`
  mutation UpdateRating($id: Int!, $comment: String!) {
    updateRating(filter: { id: $id }, set: { comment: $comment }) {
      id
      createdAt
      updatedAt
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

const DELETE_RATING_MUTATION = gql`
  mutation DeleteRating($id: Int!) {
    deleteRating(id: $id) {
      id
      createdAt
      updatedAt
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
      pageSize: 10000
    ) {
      id
      name
      slug
      ratings {
        id
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

export async function updateRating(id: number, newComment: string) {
  if (typeof id !== "number") {
    id = parseInt(id);
  }

  const apolloClient = initializeApollo();

  const accessToken = localStorage.getItem("accessToken");

  const response = await apolloClient.mutate({
    mutation: UPDATE_RATING_MUTATION,
    variables: {
      id,
      comment: newComment,
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

  if (!response.data || !response.data.updateRating) {
    return null;
  }

  const rating = response.data.updateRating;
  return rating;
}

export async function deleteRating(id: number) {
  if (typeof id !== "number") {
    id = parseInt(id);
  }

  const apolloClient = initializeApollo();

  const accessToken = localStorage.getItem("accessToken");

  const response = await apolloClient.mutate({
    mutation: DELETE_RATING_MUTATION,
    variables: {
      id,
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

  if (!response.data || !response.data.deleteRating) {
    return null;
  }

  const rating = response.data.deleteRating;
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
