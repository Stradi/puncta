export const convertArgsToWhereClause = (priorityArray: string[], obj: any) => {
  const where: {
    [key: string]: any;
  } = {};

  for (const key of priorityArray) {
    // Stupid JS accepts 0 as false...
    if (typeof obj[key] !== 'undefined') {
      where[key] = obj[key];
      break;
    }
  }
  return where;
};
