import { AuthContext } from "@/context/AuthContext";
import { ModalContext } from "@/context/ModalContext";
import { deleteRating, updateRating } from "@/lib/rate";
import {
  cn,
  getRatingMeta,
  getRatingTags,
  ratingsToLetterGrade,
  toReadableDate,
} from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import Button from "./Button";
import Chip from "./Chip";
import { TrashIcon } from "./Icons";
import LetterGrade from "./LetterGrade";
import { ProgressBarChart } from "./ProgressBarChart";
import RateBar from "./RateBar";

interface SingleRatingProps extends React.PropsWithChildren<Rating> {}

export default function SingleRating({
  id,
  meta,
  comment,
  createdAt,
  children,
}: SingleRatingProps) {
  const authContext = useContext(AuthContext);
  const modalContext = useContext(ModalContext);

  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [originalComment, setOriginalComment] = useState(comment);
  const [newComment, setNewComment] = useState(comment);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const criterias = getRatingMeta({
    meta,
  } as Rating);

  const tags = getRatingTags({
    meta,
  } as Rating);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing, inputRef]);

  return (
    <div className={cn("group flex flex-col md:flex-row")}>
      <LetterGrade
        letter={ratingsToLetterGrade([
          {
            meta,
          },
        ] as Rating[])}
        size="large"
        className="h-auto min-h-[3rem] w-full shrink-0 justify-start pl-4 text-5xl md:min-h-[7rem] md:w-28 md:justify-center md:pl-0 md:text-8xl"
      />
      <div
        className={cn(
          "relative flex w-full flex-col justify-between gap-4 p-4",
          "border-x-2 border-b-2 border-black md:border-y-2 md:border-l-0 md:border-r-2"
        )}
      >
        <div className="flex justify-between text-sm font-medium">
          {children}
          {authContext.isAuthenticated &&
            authContext.user?.ratings?.find((rating) => rating.id === id) && (
              <div className="flex">
                <Button
                  variant="text"
                  onClick={() => {
                    setIsEditing(!isEditing);
                  }}
                >
                  {isEditing ? "İptal Et" : "Yorumumu Düzenle"}
                </Button>
                {isEditing && (
                  <Button
                    variant="text"
                    onClick={async () => {
                      const response = await updateRating(
                        id as number,
                        newComment
                      );
                      if (response.id) {
                        authContext.updateRatingOfUser(response.id, response);
                        setOriginalComment(response.comment);
                      }
                      setIsEditing(false);
                    }}
                  >
                    Değişiklikleri Kaydet
                  </Button>
                )}
              </div>
            )}
        </div>
        <hr></hr>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            className="font-medium"
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
          />
        ) : (
          <p className={cn("font-medium")}>{originalComment}</p>
        )}
        <hr></hr>
        <div className="space-y-4">
          <div className="grid lg:grid-cols-3 [&>*]:p-2">
            {criterias.map((criteria) => (
              <div
                key={criteria.name}
                className="grid grid-cols-2 items-center gap-4"
              >
                <p className="font-semibold">{criteria.localizedName}</p>
                <div className="">
                  <RateBar value={criteria.score} max={10} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Chip key={tag.name} label={tag.localizedName} />
            ))}
          </div>
        </div>
        <hr></hr>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {toReadableDate(createdAt as string)}
          </p>
          {authContext.isAuthenticated &&
            authContext.user?.ratings?.find((rating) => rating.id === id) && (
              <TrashIcon
                size="sm"
                stroke="thick"
                className="cursor-pointer hover:text-red-500"
                onClick={() => {
                  modalContext.setContent(
                    <div>
                      <h1 className="text-2xl font-bold">
                        Değerlendirmeni Sil
                      </h1>
                      <p className="mt-4">
                        Değerlendirmeni silmek istediğinize emin misiniz? Bu
                        işlem geri alınamaz.
                      </p>
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="text"
                          onClick={() => {
                            modalContext.setIsOpen(false);
                          }}
                        >
                          İptal Et
                        </Button>
                        <Button
                          onClick={async () => {
                            const response = await deleteRating(id as number);
                            if (response.id) {
                              authContext.deleteRatingFromUser(response.id);
                              router.refresh();
                            }
                            modalContext.setIsOpen(false);
                          }}
                        >
                          Sil
                        </Button>
                      </div>
                    </div>
                  );
                  modalContext.setIsOpen(true);
                }}
              />
            )}
        </div>
      </div>
    </div>
  );
}
