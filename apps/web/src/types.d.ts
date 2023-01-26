interface CommonResource {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface Faculty extends Partial<CommonResource> {
  universities?: University[];
  teachers?: Teacher[];
}

interface Teacher extends Partial<CommonResource> {
  university?: University;
  faculty?: Faculty;
  ratings?: Rating[];
}

interface Rating extends Partial<Omit<CommonResource, "name" | "slug">> {
  score: number;
  comment: string;
  meta: string;
  university?: University;
  teacher?: Teacher;
}

interface University extends Partial<CommonResource> {
  faculties?: Faculty[];
  teachers?: Teacher[];
  ratings?: Rating[];
}

interface User extends Partial<CommonResource> {
  firstName: string;
  lastName: string;
  role: string;
  email: string;

  university?: University;
  faculty?: Faculty;
  ratings?: Rating[];
}

interface RateCriteria {
  name: string;
  localizedName: string;
  score: number;
}
