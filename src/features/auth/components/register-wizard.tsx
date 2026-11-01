"use client";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AuthCard } from "@/components/layout/auth-card";
import { Stepper } from "@/components/ui/stepper";
import { routes } from "@/config/site";
import { useRouter } from "@/i18n/navigation";
import { dmyToIso } from "@/lib/date";
import { toApiPhone } from "@/lib/phone";
import { useApiErrorMessage } from "../hooks/use-api-error-message";
import { useRegisterStepOne, useRegisterStepTwo } from "../hooks/use-auth";
import { clearAuthFlow, readAuthFlow, saveAuthFlow } from "../lib/auth-flow";
import { buildRegisterPayload, type IdentityDraft } from "../lib/register-payload";
import type { PasswordForm, PersonalForm } from "../schemas/auth.schemas";
import type { IdentityType } from "../types";
import { StepIdentity } from "./step-identity";
import { StepLicense } from "./step-license";
import { StepPassword } from "./step-password";
import { StepPersonal } from "./step-personal";

type Step = 1 | 2 | 3 | 4;
const TOTAL_STEPS = 4;

export function RegisterWizard() {
  const t = useTranslations("auth.register");
  const errorMessage = useApiErrorMessage();
  const router = useRouter();
  const stepOne = useRegisterStepOne();
  const stepTwo = useRegisterStepTwo();

  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [personal, setPersonal] = useState<PersonalForm>();
  const [identityType, setIdentityType] = useState<IdentityType>("national_id");
  const [identity, setIdentity] = useState<IdentityDraft>();
  const [password, setPassword] = useState<PasswordForm>();

  // Resume at step 2 after the OTP screen verified the phone.
  useEffect(() => {
    const flow = readAuthFlow();
    if (flow?.flow === "register" && flow.verified) {
      setVerifiedPhone(flow.phone);
      setStep(2);
    }
    setReady(true);
  }, []);

  const submitPersonal = (values: PersonalForm) => {
    const phone = toApiPhone(values.phone);
    const unchanged = verifiedPhone === phone && JSON.stringify(values) === JSON.stringify(personal);
    setPersonal(values);
    if (unchanged) return setStep(2);
    stepOne.mutate(
      { name: values.name, email: values.email, phone, date_of_birth: dmyToIso(values.date_of_birth) },
      {
        onSuccess: () => {
          saveAuthFlow({ flow: "register", phone, verified: false });
          router.push(routes.verifyPhone);
        },
      },
    );
  };

  const submitLicense = (license: Parameters<typeof buildRegisterPayload>[3]) => {
    if (!verifiedPhone || !identity || !password) return;
    stepTwo.mutate(buildRegisterPayload(verifiedPhone, identity, password, license), {
      onSuccess: () => {
        clearAuthFlow();
        router.replace(routes.home);
        router.refresh();
      },
    });
  };

  const heading =
    step === 1 || step === 2 || step === 3 ? { title: t(`step${step}.title`), subtitle: t(`step${step}.subtitle`) } : null;

  return (
    <AuthCard>
      <Stepper total={TOTAL_STEPS} current={step} label={t("stepLabel", { current: step, total: TOTAL_STEPS })} />
      {heading && (
        <div className="my-8 flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-bold">{heading.title}</h2>
          <p className="text-xs text-muted">{heading.subtitle}</p>
        </div>
      )}
      <div className={heading ? "" : "mt-8"}>
        {ready && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {step === 1 && (
                <StepPersonal
                  defaults={personal}
                  loading={stepOne.isPending}
                  error={errorMessage(stepOne.error)}
                  onSubmit={submitPersonal}
                />
              )}
              {step === 2 && (
                <StepIdentity
                  type={identityType}
                  onTypeChange={setIdentityType}
                  draft={identity}
                  onBack={() => setStep(1)}
                  onSubmit={(v) => {
                    setIdentity(v);
                    setStep(3);
                  }}
                />
              )}
              {step === 3 && (
                <StepPassword
                  defaults={password}
                  onBack={() => setStep(2)}
                  onSubmit={(v) => {
                    setPassword(v);
                    setStep(4);
                  }}
                />
              )}
              {step === 4 && (
                <StepLicense
                  loading={stepTwo.isPending}
                  error={errorMessage(stepTwo.error)}
                  apiError={stepTwo.error}
                  onBack={() => setStep(3)}
                  onSubmit={submitLicense}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </AuthCard>
  );
}
