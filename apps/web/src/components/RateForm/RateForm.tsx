import { ModalContext } from '@/context/ModalContext';
import { RateContext } from '@/context/RateContext';
import { FormikProps } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createRef, useContext, useEffect, useState } from 'react';
import Button from '../Button';
import BaseRatingForm from './forms/BaseRatingForm';
import FinalScreen from './forms/FinalScreen';
import IntroScreen from './forms/IntroScreen';
import TagSelectForm from './forms/TagSelectForm';
import FirstTeacherForm from './forms/teacher/FirstTeacherForm';
import SecondTeacherForm from './forms/teacher/SecondTeacherForm';
import FirstUniversityForm from './forms/university/FirstUniversityForm';
import SecondUniversityForm from './forms/university/SecondUniversityForm';

import TeacherTraits from './forms/data/teacher-traits.json';
import UniversityTraits from './forms/data/university-traits.json';

export default function RateForm(props: React.ComponentPropsWithoutRef<'div'>) {
  const formRef = createRef<FormikProps<any>>();
  const rateContext = useContext(RateContext);
  const modalContext = useContext(ModalContext);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (rateContext.step === 0) {
      modalContext.setCloseConfirmation(null);
    } else {
      modalContext.setCloseConfirmation(
        <div>
          <h1 className="mb-4 text-2xl font-medium">Değerlendirmen kaydedilmeyecek.</h1>
          <p className="mb-4">Eğer bu pencereyi kapatırsanız hali hazırda girdiğin puanlar kaybolacak.</p>
        </div>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rateContext.step]);

  async function handlePrev() {
    rateContext.prevStep();
  }

  async function handleNext() {
    // If we are in the last step (rateContext.step === 5), we need to
    // rate the teacher or university.
    if (rateContext.step === 5) {
      setIsLoading(true);
      rateContext.rate().then((isSuccessfull) => {
        if (isSuccessfull) {
          setTimeout(() => {
            modalContext.setIsOpen(false);
            setIsLoading(false);
            router.refresh();
          }, 1000);
        } else {
          // Something happened, show error.
          setIsLoading(false);
          return;
        }
      });

      modalContext.setIsOpen(false);
      router.refresh();
    } else {
      if (rateContext.step === 0) {
        rateContext.nextStep();
      } else {
        formRef.current?.submitForm();
      }
    }
  }

  return (
    <div className="py-8 px-2">
      {isLoading && (
        <div className="absolute top-0 left-0 z-50 flex h-full w-full flex-col items-center justify-center gap-4 bg-black/80">
          <div className="border-primary-normal h-16 w-16 animate-spin rounded-full border-y-2 border-r-4"></div>
          <p className="px-4 text-center text-xl font-medium text-white">Değerlendirmen paylaşılıyor. Lütfen biraz bekle.</p>
        </div>
      )}
      <h1 className="mb-4 text-center text-3xl font-medium">Değerlendir</h1>
      <AnimatePresence>
        <motion.div key={rateContext.step} initial={{ opacity: 0, height: '0px' }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: '0px' }}>
          {rateContext.step === 0 && <IntroScreen />}
          {rateContext.step === 1 && (rateContext.ratingTo.type === 'teacher' ? <FirstTeacherForm ref={formRef} /> : <FirstUniversityForm ref={formRef} />)}
          {rateContext.step === 2 && (rateContext.ratingTo.type === 'teacher' ? <SecondTeacherForm ref={formRef} /> : <SecondUniversityForm ref={formRef} />)}
          {rateContext.step === 3 && <TagSelectForm ref={formRef} tags={rateContext.ratingTo.type === 'university' ? UniversityTraits : TeacherTraits} />}
          {rateContext.step === 4 && <BaseRatingForm ref={formRef} />}
          {rateContext.step === 5 && <FinalScreen />}
        </motion.div>
      </AnimatePresence>
      <div className="mt-8 flex justify-evenly">
        <Button variant="text" fullWidth onClick={handlePrev} disabled={rateContext.step <= 0}>
          Geri Dön
        </Button>
        <Button fullWidth onClick={handleNext}>
          {rateContext.step === 5 ? 'Paylaş' : 'Devam Et'}
        </Button>
      </div>
    </div>
  );
}
