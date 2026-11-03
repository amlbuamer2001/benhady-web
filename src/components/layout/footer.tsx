import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { navLinks, routes, siteConfig } from "@/config/site";
import { Logo } from "./logo";
import { SocialLinks } from "./social-links";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const quick = [
    { label: nav("home"), href: "/" },
    { label: nav("about"), href: navLinks[1].href },
    { label: nav("contact"), href: navLinks[3].href },
    { label: t("terms"), href: routes.terms },
    { label: t("privacy"), href: routes.privacy },
  ];

  return (
    <footer className="mt-auto rounded-t-[2rem] bg-primary-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-8 md:grid-cols-3">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-xs leading-6 text-ink">{t("description")}</p>
          <SocialLinks tone="ink" />
        </div>

        <nav aria-labelledby="footer-quick" className="flex flex-col gap-4">
          <h2 id="footer-quick" className="text-lg font-bold">
            {t("quickLinks")}
          </h2>
          <ul className="flex flex-col gap-3 text-sm text-muted">
            {quick.map((q) => (
              <li key={q.href}>
                <Link href={q.href} className="transition-colors hover:text-primary">
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="flex flex-col gap-4 not-italic">
          <h2 className="text-lg font-bold">{t("contactUs")}</h2>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-3">
              <MailIcon className="shrink-0 text-primary" width={16} height={16} />
              <a href={`mailto:${siteConfig.contact.email}`} dir="ltr">{siteConfig.contact.email}</a>
            </li>
            <li className="flex items-center gap-3">
              <PinIcon className="shrink-0 text-primary" width={16} height={16} />
              <span>{t("address")}</span>
            </li>
            {siteConfig.contact.phones.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <PhoneIcon className="shrink-0 text-primary" width={16} height={16} />
                <a href={`tel:${p.replace(/\s/g, "")}`} dir="ltr">{p}</a>
              </li>
            ))}
          </ul>
        </address>
      </div>
      <div className="border-t border-line py-5 text-center text-xs font-medium">
        {t("rights", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
