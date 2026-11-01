import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface Props {
  onBack?: () => void;
  nextLabel?: string;
  loading?: boolean;
}

/** Back (outline, narrow) + Next (solid, wide). Step 1 shows Next only. */
export function StepActions({ onBack, nextLabel, loading }: Props) {
  const t = useTranslations("common");
  return (
    <div className="flex gap-3">
      {onBack && (
        <Button variant="outline" onClick={onBack} className="flex-1">
          {t("previous")}
        </Button>
      )}
      <Button type="submit" loading={loading} className={onBack ? "flex-[2]" : "w-full"}>
        {nextLabel ?? t("next")}
      </Button>
    </div>
  );
}
