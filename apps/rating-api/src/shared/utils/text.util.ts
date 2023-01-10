import { default as _slugify } from 'slugify';

export const slugify = (text: string) => {
  return _slugify(text, { lower: true });
};
