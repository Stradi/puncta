import { AuthContext } from "@/context/AuthContext";
import { ModalContext } from "@/context/ModalContext";
import { RateContext, RateProvider } from "@/context/RateContext";
import { useContext } from "react";
import Button from "./Button";
import RateForm from "./RateForm";

function isUniversityRated(ratings: Rating[], universitySlug: string) {
  return ratings.some((rating) => rating.university?.slug === universitySlug);
}

function canRateUniversity(user: Partial<User>, universitySlug: string) {
  return user.university?.slug === universitySlug;
}

function isTeacherRated(ratings: Rating[], teacherSlug: string) {
  return ratings.some((rating) => rating.teacher?.slug === teacherSlug);
}

function canRateTeacher(
  user: Partial<User>,
  universitySlug: string,
  facultySlug: string
) {
  return (
    user?.university?.slug === universitySlug &&
    user?.faculty?.slug === facultySlug
  );
}

export default function AuthCardFooter() {
  const rateContext = useContext(RateContext);
  const authContext = useContext(AuthContext);
  const modalContext = useContext(ModalContext);

  if (!authContext.isAuthenticated) {
    return <></>;
  }

  let alreadRated = false;
  let canRate = false;

  if (rateContext.ratingTo.type === "university") {
    canRate = canRateUniversity(
      authContext.user as Partial<User>,
      rateContext.ratingTo.university.slug
    );

    alreadRated = isUniversityRated(
      authContext.user?.ratings as Rating[],
      rateContext.ratingTo.university.slug
    );
  } else {
    canRate = canRateTeacher(
      authContext.user as Partial<User>,
      rateContext.ratingTo.university.slug,
      rateContext.ratingTo.faculty.slug
    );
    alreadRated = isTeacherRated(
      authContext.user?.ratings as Rating[],
      rateContext.ratingTo.teacher.slug
    );
  }

  const localizedText = {
    university: {
      alreadyRated: "Görünüşe göre bu üniversiteyi zaten puanlamışsınız.",
      rate: "Görünüşe göre bu üniversiteyi okuyorsunuz. Bu üniversite hakkında ne düşünüyorsunuz?",
    },
    teacher: {
      alreadyRated: "Görünüşe göre bu öğretmeni zaten puanlamışsınız.",
      rate: "Görünüşe göre bu öğretmen ile aynı bölümdesin. Bu öğretmen hakkında ne düşünüyorsunuz?",
    },
  };

  if (canRate) {
    return (
      <div className="space-y-2 p-4 font-medium">
        {/* TODO: We should add Edit Rating button here */}
        {alreadRated ? (
          <p>
            {rateContext.ratingTo.type === "university"
              ? localizedText.university.alreadyRated
              : localizedText.teacher.alreadyRated}
          </p>
        ) : (
          <>
            <p>
              {rateContext.ratingTo.type === "university"
                ? localizedText.university.rate
                : localizedText.teacher.rate}
            </p>
            <Button
              fullWidth
              onClick={() => {
                modalContext.setContent(
                  <RateProvider {...rateContext.ratingTo}>
                    <RateForm />
                  </RateProvider>
                );
                modalContext.setIsOpen(true);
              }}
            >
              Değerlendir
            </Button>
          </>
        )}
      </div>
    );
  } else {
    return <></>;
  }
}
