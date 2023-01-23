import { BaseProps, fetchUniversity } from "./helpers";

export default async function Head({ params }: BaseProps) {
  const university = await fetchUniversity(params.universitySlug);
  return (
    <>
      <title>{`${university.name} | Puncta`}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
    </>
  );
}
