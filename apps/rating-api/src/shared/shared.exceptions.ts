import { GraphQLError } from 'graphql';

const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export class GenericNotFoundError extends GraphQLError {
  constructor(resource: string) {
    super(`${capitalizeFirstLetter(resource)} could not be found.`, {
      extensions: {
        code: `${resource.toUpperCase()}_NOT_FOUND`,
        http: {
          status: 404,
        },
      },
    });
  }
}

export class GenericAlreadyExistsError extends GraphQLError {
  constructor(resource: string) {
    super(`${capitalizeFirstLetter(resource)} already exists.`, {
      extensions: {
        code: `${resource.toUpperCase()}_ALREADY_EXISTS`,
        http: {
          status: 409,
        },
      },
    });
  }
}

export class GenericInvalidParameterError extends GraphQLError {
  constructor(parameter: string | string[], additionalMessage: string) {
    const hasMultipleParameters = parameter instanceof Array;
    super(
      `${hasMultipleParameters ? parameter.join(', ') : parameter} parameter${
        hasMultipleParameters ? 's are' : ' is'
      } invalid. ${additionalMessage}`,
      {
        extensions: {
          code: 'INVALID_PARAMETER',
          http: {
            status: 400,
          },
        },
      },
    );
  }
}

export const UniversityNotFoundError = new GenericNotFoundError('university');
export const UniversityAlreadyExistsError = new GenericAlreadyExistsError('university');

export const FacultyNotFoundError = new GenericNotFoundError('faculty');
export const FacultyAlreadyExistsError = new GenericAlreadyExistsError('faculty');

export const TeacherNotFoundError = new GenericNotFoundError('teacher');
export const TeacherAlreadyExistsError = new GenericAlreadyExistsError('teacher');

export const RatingNotFoundError = new GenericNotFoundError('rating');
export const RatingAlreadyExistsError = new GenericAlreadyExistsError('rating');
