import { cn } from "@/lib/utils";
import { useField } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../Button";

interface TagCloudInputProps {
  name: string;
  label: string;

  tags: RateTag[];
}

export default function TagCloudInput({
  name,
  label,
  tags,
}: TagCloudInputProps) {
  const [field, meta, helpers] = useField({ name });

  function isValueSelected(value: RateTag) {
    return field.value.includes(value);
  }

  return (
    <div>
      <div className="flex justify-between">
        <label htmlFor={name} className="font-medium text-neutral-700">
          {label}
        </label>
        <Button
          variant="text"
          onClick={() => {
            helpers.setValue([]), helpers.setTouched(false);
          }}
        >
          Temizle
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {tags.map((tag) => (
          <div
            key={tag.name}
            onClick={() => {
              helpers.setTouched(true, true);
              if (isValueSelected(tag)) {
                helpers.setValue(
                  field.value.filter((v: RateTag) => v.name !== tag.name)
                );
              } else {
                helpers.setValue([...field.value, tag]);
              }
            }}
            className={cn(
              "border-1 rounded-full px-4 py-2 text-sm font-medium ring-1 ring-black",
              "transition duration-100",
              "hover:cursor-pointer hover:ring-2",
              "active:ring-1",
              isValueSelected(tag)
                ? "bg-primary-normal hover:bg-primary-normal-hover ring-2"
                : "bg-primary-light hover:bg-primary-light-hover"
            )}
          >
            {tag.localizedName}
          </div>
        ))}
      </div>
      <AnimatePresence>
        {meta.error && meta.touched && (
          <motion.div
            className={cn("text-sm font-medium text-red-600")}
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
          >
            {meta.error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
