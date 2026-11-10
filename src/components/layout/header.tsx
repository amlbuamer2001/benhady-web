import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { ChatIcon, ChevronEndIcon, ContractIcon, HelpIcon, InfoIcon, WalletIcon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/button";
import { navLinks, routes } from "@/config/site";
import { getSession } from "@/lib/auth/session";
import { BottomNav } from "./bottom-nav";
import { HeaderShell } from "./header-shell";
import { Logo } from "./logo";
import { LocaleSwitcher } from "./locale-switcher";
import { LogoutButton } from "./logout-button";
import { MobileMenu, SheetItem } from "./mobile-menu";
import { NavLink } from "./nav-link";
import { NotificationBell } from "./notification-bell";
import { SocialLinks } from "./social-links";
import { UserMenu } from "./user-menu";

function Avatar({ size }: { size: number }) {
  return (
    <span className="relative block shrink-0 overflow-hidden rounded-full ring-2 ring-primary/30" style={{ width: size, height: size }}>
      <Image src="/icons/avatar.svg" alt="" fill sizes={`${size}px`} unoptimized />
    </span>
  );
}

function SheetRow({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <Link href={href} className="flex h-14 items-center gap-3 px-4 transition-colors active:bg-primary-100">
      <span className="grid size-9 place-items-center rounded-xl bg-primary-100 text-primary">{icon}</span>
      <span className="flex-1 text-sm font-bold">{label}</span>
      <ChevronEndIcon className="text-muted" />
    </Link>
  );
}

export async function Header() {
  const t = await getTranslations("nav");
  const session = await getSession();
  const name = session?.user?.name ?? "";

  const guestActions = (
    <>
      <Link href={routes.login} className={buttonClasses({ variant: "outline", size: "sm" })}>
        {t("login")}
      </Link>
      <Link href={routes.register} className={buttonClasses({ size: "sm" })}>
        {t("register")}
      </Link>
    </>
  );

  return (
    <>
      <HeaderShell>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 transition-[height] duration-300 sm:px-8 lg:h-[76px] lg:group-data-[scrolled=true]:h-16">
          <Logo />
          <nav aria-label={t("main")} className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <NavLink key={l.key} href={l.href} className="text-sm">
                {t(l.key)}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <LocaleSwitcher className="hidden text-sm text-muted transition-colors hover:text-primary sm:flex" />
            {session ? (
              <>
                {/* TODO: feed the unread count from the notifications API. */}
                <NotificationBell count={2} />
                <div className="hidden lg:block">
                  <UserMenu name={name} />
                </div>
                <Link href={routes.profile} aria-label={t("profile")} className="lg:hidden">
                  <Avatar size={38} />
                </Link>
              </>
            ) : (
              <>
                <div className="hidden items-center gap-3 lg:flex">{guestActions}</div>
                <Link href={routes.login} className={`${buttonClasses({ size: "sm" })} !h-9 !px-5 lg:hidden`}>
                  {t("login")}
                </Link>
              </>
            )}
          </div>
        </div>
      </HeaderShell>

      <BottomNav authed={!!session}>
        <MobileMenu>
          <SheetItem>
            {session ? (
              <Link href={routes.profile} className="flex items-center gap-4 rounded-3xl bg-gradient-to-l from-primary to-primary-hover p-4 text-white">
                <Avatar size={56} />
                <span className="flex flex-1 flex-col gap-1">
                  <span className="text-base font-bold">{name}</span>
                  <span className="text-xs text-white/85">{t("viewProfile")}</span>
                </span>
                <ChevronEndIcon />
              </Link>
            ) : (
              <div className="flex flex-col gap-4 rounded-3xl bg-primary-100 p-5 text-center">
                <div>
                  <p className="text-base font-bold">{t("guestTitle")}</p>
                  <p className="mt-1 text-xs text-muted">{t("guestSubtitle")}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">{guestActions}</div>
              </div>
            )}
          </SheetItem>

          {session && (
            <SheetItem>
              <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line">
                <SheetRow href={routes.contracts} icon={<ContractIcon />} label={t("contracts")} />
                <SheetRow href={routes.wallet} icon={<WalletIcon />} label={t("wallet")} />
              </div>
            </SheetItem>
          )}

          <SheetItem>
            <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line">
              <SheetRow href={navLinks[1].href} icon={<InfoIcon />} label={t("about")} />
              <SheetRow href={navLinks[3].href} icon={<ChatIcon />} label={t("contact")} />
              <SheetRow href={navLinks[4].href} icon={<HelpIcon />} label={t("faq")} />
            </div>
          </SheetItem>

          <SheetItem>
            <div className="flex h-14 items-center justify-between rounded-3xl border border-line px-4">
              <span className="text-sm font-bold">{t("language")}</span>
              <LocaleSwitcher className="rounded-full bg-primary-100 px-4 py-2 text-sm font-bold text-primary" />
            </div>
          </SheetItem>

          <SheetItem>
            <SocialLinks className="justify-center" />
          </SheetItem>

          {session && (
            <SheetItem>
              <LogoutButton fullWidth />
            </SheetItem>
          )}
        </MobileMenu>
      </BottomNav>
    </>
  );
}
