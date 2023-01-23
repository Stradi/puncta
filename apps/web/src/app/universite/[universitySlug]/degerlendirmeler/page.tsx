import SingleRating from "@/components/SingleRating";
import { BaseProps, fetchUniversity } from "../helpers";

export default async function Page({ params }: BaseProps) {
  const university = await fetchUniversity(params.universitySlug);
  const uniName = university.name as string;
  return (
    <main>
      <div className="space-y-4 md:flex md:gap-4">
        <div className="space-y-4 sm:w-full md:max-w-3xl">
          {university.ratings && university.ratings.length > 0 ? (
            university.ratings.map((rating) => (
              <SingleRating key={rating.id} {...rating} />
            ))
          ) : (
            <p className="text-2xl font-medium">
              <span className="font-bold">{uniName}</span> için henüz
              değerlendirme yapılmamış.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
