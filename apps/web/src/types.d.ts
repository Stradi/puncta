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

  universityCount?: number;
  teacherCount?: number;
}

interface Teacher extends Partial<CommonResource> {
  university?: University;
  faculty?: Faculty;
  ratings?: Rating[];

  ratingCount?: number;
}

interface Rating extends Partial<Omit<CommonResource, "name" | "slug">> {
  score: number;
  comment: string;
  meta: string;
  user?: User;
  university?: University;
  teacher?: Teacher;
}

interface University extends Partial<CommonResource> {
  faculties?: Faculty[];
  teachers?: Teacher[];
  ratings?: Rating[];

  facultyCount?: number;
  teacherCount?: number;
  ratingCount?: number;

  image?: string;
}

interface User extends Partial<CommonResource> {
  role: string;
  email: string;
  username: string;
  isAnonymous: boolean;

  university?: University;
  faculty?: Faculty;
  ratings?: Rating[];

  ratingCount?: number;
}

interface RateCriteria {
  name: string;
  localizedName: string;
  score: number;
  affectsGrade?: boolean = true;
}

interface RateTag {
  name: string;
  localizedName: string;
}

interface RateMeta {
  criterias: RateCriteria[];
  tags: RateTag[];
}
