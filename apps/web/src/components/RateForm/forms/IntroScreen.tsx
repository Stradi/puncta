import { AuthContext } from "@/context/AuthContext";
import { RateContext } from "@/context/RateContext";
import { useContext } from "react";

interface IntroScreenProps {}

export default function IntroScreen() {
  const rateContext = useContext(RateContext);
  const authContext = useContext(AuthContext);

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
        Hoşgeldin <b>{authContext.user?.firstName}</b>. Görüşüne göre{" "}
        <b>{ratingTo.name}</b> adlı {ratingTo.typeLocalized} değerlendirmek
        istiyorsun.
      </p>
      <p>
        Bu değerlendirmeyi yaparken, senin gibi diğer öğrencilere yardımı
        dokunması için tamamen <b>objektif</b> ve <b>gerçekçi</b> olacağını
        umuyoruz.
      </p>
      <p>
        Hazırsan &apos;<b>Devam Et</b>&apos; butonuna tıklayabilirsin.
      </p>
    </div>
  );
}
