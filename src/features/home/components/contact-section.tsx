"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, type TargetAndTransition } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SocialLinks } from "@/components/layout/social-links";
import { Button } from "@/components/ui/button";
import { FieldShell, TextareaField, TextField } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/form-alert";
import { Select } from "@/components/ui/select";
import { siteConfig } from "@/config/site";
import { useFieldError } from "@/hooks/use-field-error";
import { contactSchema, inquiryTypes, type ContactForm } from "../schemas/contact.schema";

const tel = (p: string) => `tel:${p.replace(/\s/g, "")}`;

function InfoRow({ icon, label, value, href, effect }: { icon: string; label: string; value: string; href: string; effect: TargetAndTransition }) {
  return (
    <motion.li whileHover="hover" whileTap="hover" className="flex items-center gap-4">
      <motion.span
        variants={{ hover: effect }}
        transition={{ duration: 0.6 }}
        className="grid size-12 shrink-0 place-items-center rounded-full bg-white shadow-sm"
      >
        <Image src={icon} alt="" width={22} height={22} />
      </motion.span>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted">{label}</span>
        <a href={href} dir="ltr" className="text-base font-bold transition-colors hover:text-primary rtl:text-right">
          {value}
        </a>
      </div>
    </motion.li>
  );
}

export function ContactSection() {
  const t = useTranslations("home.contact");
  const fieldError = useFieldError();
  const typeId = useId();
  const [sent, setSent] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema), defaultValues: { type: "other" } });

  // TODO: no contact endpoint in the API docs yet — send `data` to it once it exists.
  const onSubmit = handleSubmit(async () => {
    setSent(true);
    reset();
  });

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-8 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: "var(--slide-from-start)" }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 70, damping: 18 }}
        className="flex flex-col gap-6 rounded-3xl bg-primary-100 p-6 sm:p-8"
      >
        <h2 className="text-2xl font-bold">{t("infoTitle")}</h2>
        <ul className="flex flex-col gap-6">
          <InfoRow icon="/icons/phone.svg" label={t("phone")} value={siteConfig.contact.phones[0]} href={tel(siteConfig.contact.phones[0])} effect={{ rotate: [0, -20, 20, -15, 15, 0] }} />
          <InfoRow icon="/icons/mail.svg" label={t("email")} value={siteConfig.contact.email} href={`mailto:${siteConfig.contact.email}`} effect={{ y: [0, -6, 0], rotate: [0, -8, 0] }} />
          <InfoRow icon="/icons/whatsapp.svg" label={t("whatsapp")} value={siteConfig.contact.whatsapp} href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}`} effect={{ rotate: 360, scale: 1.1 }} />
        </ul>
        <div className="mt-2 flex flex-col gap-4">
          <h3 className="text-base font-bold">{t("follow")}</h3>
          <SocialLinks />
        </div>
      </motion.div>

      <motion.form
        noValidate
        onSubmit={onSubmit}
        initial={{ opacity: 0, x: "var(--slide-from-end)" }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 70, damping: 18, delay: 0.1 }}
        className="flex flex-col gap-5"
      >
        <h2 className="text-2xl font-bold text-primary">{t("formTitle")}</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label={t("name")} placeholder={t("namePlaceholder")} autoComplete="name" error={fieldError(errors.name?.message)} {...register("name")} />
          <TextField label={t("emailLabel")} type="email" placeholder={t("emailPlaceholder")} autoComplete="email" error={fieldError(errors.email?.message)} {...register("email")} />
        </div>
        <FieldShell id={typeId} label={t("type")}>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                id={typeId}
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                options={inquiryTypes.map((type) => ({ value: type, label: t(`types.${type}`) }))}
              />
            )}
          />
        </FieldShell>
        <TextareaField
          label={t("message")}
          rows={5}
          placeholder={t("messagePlaceholder")}
          error={fieldError(errors.message?.message)}
          {...register("message", { onChange: () => setSent(false) })}
        />
        {sent && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <FormAlert tone="success" message={t("success")} />
          </motion.div>
        )}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <Button type="submit" fullWidth loading={isSubmitting}>
            {t("submit")}
          </Button>
        </motion.div>
      </motion.form>
    </section>
  );
}
