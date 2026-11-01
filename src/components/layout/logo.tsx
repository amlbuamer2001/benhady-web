import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={className} aria-label="Bin Hadi">
      {/* Replace /images/logo.svg with the original Figma export. */}
      <Image src="/images/logo.svg" alt="" width={72} height={40} priority className="h-10 w-auto" />
    </Link>
  );
}
