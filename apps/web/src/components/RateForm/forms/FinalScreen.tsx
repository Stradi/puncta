import { RateContext } from "@/context/RateContext";
import { useContext } from "react";

interface FinalScreenProps {}

export default function FinalScreen() {
  const rateContext = useContext(RateContext);

  const ratingTo = {
    type: rateContext.ratingTo.type,
    typeLocalized: "",
    name: "",
    slug: "",
  };

  if (rateContext.ratingTo.type === "university") {
    ratingTo.name = rateContext.ratingTo.university.name;
    ratingTo.slug = rateContext.ratingTo.university.slug;
    ratingTo.typeLocalized = "üniversiteyi";
  } else {
    ratingTo.name = rateContext.ratingTo.teacher.name;
    ratingTo.slug = rateContext.ratingTo.teacher.slug;
    ratingTo.typeLocalized = "öğretmeni";
  }

  return (
    <div className="space-y-2 text-lg">
      <p>
        Değerlendirmeni paylaşmadan önce &apos;<b>Geri Dön</b>&apos; butonu
        yardımıyla tekrardan kontrol edebilirsin.
      </p>
      <p>
        Eğer her şey doğru gözüküyor ise, &apos;<b>Paylaş</b>&apos; butonuna
        basarak değerlendirmeni yayınla.
      </p>
    </div>
  );
}
