import { BaseProps, fetchUniversity } from "./helpers";

export default async function Home({ params }: BaseProps) {
  const university = await fetchUniversity(params.universitySlug);
  return <div>{university.name}</div>;
}
