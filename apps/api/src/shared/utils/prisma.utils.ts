export const convertArgsToWhereClause = (priorityArray: string[], obj: any) => {
  const where: {
    [key: string]: any;
  } = {};

  for (const key of priorityArray) {
    if (obj[key]) {
      where[key] = obj[key];
      break;
    }
  }
  return where;
};
