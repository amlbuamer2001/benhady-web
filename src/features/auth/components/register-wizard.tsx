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
import { errorsForStep, firstStepWithError, serverFieldErrors, type RegisterStep } from "../lib/register-errors";
import type { LicenseForm, PasswordForm, PersonalForm } from "../schemas/auth.schemas";
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
  // Kept in memory only – passwords are never written to storage.
  const [password, setPassword] = useState<PasswordForm>();
  const [license, setLicense] = useState<Partial<LicenseForm>>();
  const [editingPhone, setEditingPhone] = useState(false);

  // Coming back to the page (from the OTP screen, terms, browser back…): restore everything typed.
  useEffect(() => {
    const flow = readAuthFlow();
    if (flow?.flow === "register") {
      if (flow.personal) setPersonal(flow.personal);
      if (flow.verified) {
        setVerifiedPhone(flow.phone);
        const draft = flow.draft;
        if (draft) {
          setIdentityType(draft.identityType);
          setIdentity(draft.identity);
          setLicense(draft.license);
        }
        // The password wasn't saved, so anything past step 3 resumes at the password step.
        setStep(draft ? (Math.min(draft.step, 3) as Step) : 2);
      } else if (flow.editingPhone) {
        setEditingPhone(true);
        saveAuthFlow({ ...flow, editingPhone: false });
      }
    }
    setReady(true);
  }, []);

  // Save progress on every change once the phone is verified.
  useEffect(() => {
    if (!ready || !verifiedPhone) return;
    const flow = readAuthFlow();
    if (flow?.flow !== "register") return;
    saveAuthFlow({ ...flow, draft: { step, identityType, identity, license } });
  }, [ready, verifiedPhone, step, identityType, identity, license]);

  const submitPersonal = (values: PersonalForm) => {
    const phone = toApiPhone(values.phone);
    const unchanged = verifiedPhone === phone && JSON.stringify(values) === JSON.stringify(personal);
    setPersonal(values);
    if (unchanged) return setStep(2);
    stepOne.mutate(
      { name: values.name, email: values.email, phone, date_of_birth: dmyToIso(values.date_of_birth) },
      {
        onSuccess: () => {
          saveAuthFlow({ flow: "register", phone, verified: false, personal: values });
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
      // A problem with a field from an earlier step: go back there so it can be fixed.
      onError: (error) => {
        const target = firstStepWithError(serverFieldErrors(error));
        if (target) setStep(target);
      },
    });
  };

  // Server errors, per field and per step. A message that matches no field stays a general alert.
  const stepOneErrors = serverFieldErrors(stepOne.error);
  const stepTwoErrors = serverFieldErrors(stepTwo.error);
  const errorsAt = (s: RegisterStep) => ({ ...errorsForStep(stepTwoErrors, s), ...(s === 1 ? errorsForStep(stepOneErrors, 1) : {}) });
  const generalError = (error: unknown, fields: object) => (Object.keys(fields).length ? undefined : errorMessage(error));

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
                  error={generalError(stepOne.error, stepOneErrors)}
                  serverErrors={errorsAt(1)}
                  focusPhone={editingPhone}
                  onSubmit={submitPersonal}
                />
              )}
              {step === 2 && (
                <StepIdentity
                  type={identityType}
                  onTypeChange={setIdentityType}
                  draft={identity}
                  onDraftChange={setIdentity}
                  serverErrors={errorsAt(2)}
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
                  serverErrors={errorsAt(3)}
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
                  error={generalError(stepTwo.error, stepTwoErrors)}
                  serverErrors={errorsAt(4)}
                  defaults={license}
                  onDraftChange={setLicense}
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
