import { cn } from "@/lib/utils";
import { FormikProps, FormikProvider, useFormik } from "formik";
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";

interface BaseMultistepFormProps<T>
  extends React.ComponentPropsWithoutRef<"form"> {
  initialValues: T;
  validationSchema: any;
  onSubmit: (values: any) => void;
  onValuesChange?: (values: T) => void;
  getFormik?: (formik: FormikProps<T>) => void;
}

function BaseMultistepForm<T extends Record<string, any>>(
  {
    initialValues,
    validationSchema,
    onValuesChange,
    onSubmit,
    getFormik,
    className,
    children,
    ...props
  }: BaseMultistepFormProps<T>,
  ref: ForwardedRef<FormikProps<T>>
) {
  const formik = useFormik<T>({
    initialValues: initialValues,
    onSubmit: onSubmit,
    validateOnChange: false,
    validationSchema: validationSchema,
    innerRef: ref,
  });

  useImperativeHandle(ref, () => ({
    ...formik,
  }));

  useEffect(() => {
    onValuesChange?.(formik.values);
  }, [formik.values, onValuesChange]);

  // We are disabling the exhaustive-deps rule here because we only want to run this effect once.
  useEffect(() => {
    getFormik?.(formik);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormikProvider value={formik}>
      <form
        {...props}
        className={cn(
          "flex flex-col space-y-8",
          "[&>*]:flex [&>*]:flex-col",
          className
        )}
        onSubmit={formik.handleSubmit}
      >
        {children}
      </form>
    </FormikProvider>
  );
}

export default forwardRef(BaseMultistepForm);
