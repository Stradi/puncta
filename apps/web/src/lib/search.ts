import { gql } from '@apollo/client';
import { default as _slugify } from 'slugify';
import { initializeApollo } from './apollo';

const SEARCH_UNIVERSITY_QUERY = gql`
  query SearchUniversity($term: String!) {
    university(filter: { slug: { contains: $term } }) {
      name
      slug
    }
  }
`;

const SEARCH_TEACHER_QUERY = gql`
  query SearchTeacher($term: String!, $pageSize: Int) {
    teacher(filter: { slug: { contains: $term } }, pageSize: $pageSize) {
      name
      slug
      university {
        name
      }
      faculty {
        name
      }
    }
  }
`;

function slugify(text: string) {
  return _slugify(text, { lower: true });
}

export async function searchUniversity(term: string) {
  const slugified = slugify(term);
  const apolloClient = initializeApollo();

  const response = await apolloClient.query({
    query: SEARCH_UNIVERSITY_QUERY,
    variables: {
      term: slugified,
    },
  });

  if (response.errors && response.errors.length > 0) {
    console.log('Something happened while registering.');
    console.log(response.errors);
    return null;
  }

  if (!response.data || !response.data.university) {
    return null;
  }

  return response.data.university;
}

export async function searchTeacher(term: string, pageSize: number = 12) {
  const slugified = slugify(term);
  const apolloClient = initializeApollo();

  const response = await apolloClient.query({
    query: SEARCH_TEACHER_QUERY,
    variables: {
      term: slugified,
      pageSize,
    },
  });

  if (response.errors && response.errors.length > 0) {
    console.log('Something happened while registering.');
    console.log(response.errors);
    return null;
  }

  if (!response.data || !response.data.teacher) {
    return null;
  }

  return response.data.teacher;
}
