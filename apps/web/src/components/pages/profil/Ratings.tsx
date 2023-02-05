import Button from "@/components/Button";
import SingleRating from "@/components/SingleRating";

interface RatingsProps {
  ratings: Rating[];
}

export default function Ratings({ ratings }: RatingsProps) {
  const toName = (rating: Rating) => {
    if (rating.university) {
      return rating.university.name;
    }
    if (rating.teacher) {
      return rating.teacher.name;
    }
    return "Unknown";
  };

  const toLink = (rating: Rating) => {
    if (rating.university) {
      return `/universite/${rating.university.slug}`;
    }
    if (rating.teacher) {
      return `/ogretmen/${rating.teacher.slug}`;
    }
    return "/";
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {ratings.map((rating) => (
        <SingleRating key={rating.id} {...rating}>
          <div className="flex justify-between">
            <p className="text-sm font-medium">
              <Button
                variant="text"
                asLink
                href={toLink(rating)}
                className="m-0 p-0"
              >
                {toName(rating)}
              </Button>{" "}
              için yapılan değerlendirme
            </p>
          </div>
        </SingleRating>
      ))}
    </div>
  );
}
