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
      meta: JSON.stringify(payload.criterias),
      ...ratingToObj,
    },
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  if (response.errors && response.errors.length > 0) {
    console.log("Something happened while registering.");
    console.log(response.errors);
    return null;
  }

  if (!response.data || !response.data.signup) {
    return null;
  }

  const rating = response.data.createRating;
  return rating;
}
