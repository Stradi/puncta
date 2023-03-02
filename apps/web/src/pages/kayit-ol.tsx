import Button from "@/components/Button";
import { Card } from "@/components/Card";
import FinalForm from "@/components/pages/kayit-ol/forms/FinalForm";
import PasswordForm from "@/components/pages/kayit-ol/forms/PasswordForm";
import RegistrationTypeForm from "@/components/pages/kayit-ol/forms/RegistrationTypeForm";
import StudentInformationForm from "@/components/pages/kayit-ol/forms/student/StudentInformationForm";
import UniversityForm from "@/components/pages/kayit-ol/forms/student/UniversityForm";
import TeacherInformationForm from "@/components/pages/kayit-ol/forms/teacher/TeacherInformationForm";
import config from "@/config";
import { AuthContext } from "@/context/AuthContext";
import { SignUpContext, SignUpProvider } from "@/context/SignUpContext";
import { FormikProps } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import {
  createRef,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
function Page() {
  // Since we are not interested in return type of form, we can use any.
  const formRef = createRef<FormikProps<any>>();
  const signUpContext = useContext(SignUpContext);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authContext.isAuthenticated) {
      router.push("/degerlendir");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.isAuthenticated]);

  // TODO: Please refactor this step part. PLEASE!!
  return (
    <>
      <Head>
        <title>{config.site.seo.register.title}</title>
        <meta
          name="description"
          content={config.site.seo.register.description}
        />
      </Head>
      <div className="px-2">
        <Card className="relative mx-auto max-w-lg py-16 px-8">
          {isLoading && (
            <div className="absolute top-0 left-0 z-50 flex h-full w-full flex-col items-center justify-center gap-4 bg-black/80">
              <div className="border-primary-normal h-16 w-16 animate-spin rounded-full border-y-2 border-r-4"></div>
              <p className="px-4 text-center text-xl font-medium text-white">
                Kaydını tamamlıyoruz. Lütfen biraz bekle.
              </p>
            </div>
          )}
          <h1 className="mb-4 text-center text-3xl font-medium">Kayıt Ol</h1>
          <AnimatePresence>
            <motion.div
              key={signUpContext.step}
              initial={{ opacity: 0, height: "0px" }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: "0px" }}
            >
              {signUpContext.step === 0 && <RegistrationTypeForm />}
              {signUpContext.step === 1 &&
                (signUpContext.registrationType === "STUDENT" ? (
                  <StudentInformationForm ref={formRef} />
                ) : (
                  <TeacherInformationForm ref={formRef} />
                ))}
              {signUpContext.step === 2 && <PasswordForm ref={formRef} />}
              {signUpContext.step === 3 &&
                (signUpContext.registrationType === "STUDENT" ? (
                  <UniversityForm ref={formRef} />
                ) : (
                  <FinalForm />
                ))}
              {signUpContext.step === 4 && <FinalForm />}
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex justify-evenly">
            <Button
              variant="text"
              fullWidth
              onClick={() => {
                signUpContext.prevStep();
              }}
              disabled={signUpContext.step <= 0}
            >
              Geri Dön
            </Button>
            <Button
              fullWidth
              onClick={() => {
                if (signUpContext.step === 0) {
                  signUpContext.nextStep();
                  return;
                }

                if (signUpContext.registrationType === "STUDENT") {
                  if (signUpContext.step === 4) {
                    setIsLoading(true);
                    authContext
                      .register(signUpContext.getPayload())
                      .then((isSuccessfull) => {
                        setIsLoading(false);
                        if (!isSuccessfull) {
                          // TODO: Show email domain error.
                          signUpContext.setStep(1);
                        } else {
                          router.push("/degerlendir");
                        }
                      });
                  } else {
                    formRef.current?.submitForm();
                  }
                } else {
                  if (signUpContext.step === 3) {
                    authContext.register(signUpContext.getPayload());
                  } else {
                    formRef.current?.submitForm();
                  }
                }
              }}
            >
              {signUpContext.step === 3 ? "Kayıt Ol" : "Devam Et"}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <SignUpProvider>{page}</SignUpProvider>;
};

export default Page;
