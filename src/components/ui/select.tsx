"use client";
import { useTranslations } from "next-intl";
import { Select as S } from "radix-ui";
import type { ComponentProps, ReactNode, Ref } from "react";
import { CheckIcon, ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { fieldBox, fieldIcon, panelClass, type FieldSize } from "./field-styles";

/* ---------- shadcn-style primitives ---------- */
export const SelectRoot = S.Root;
export const SelectValue = S.Value;
export const SelectGroup = S.Group;

interface TriggerProps extends ComponentProps<typeof S.Trigger> {
  invalid?: boolean;
  fieldSize?: FieldSize;
  icon?: ReactNode;
}

export function SelectTrigger({ invalid, fieldSize, icon, className, children, ...props }: TriggerProps) {
  return (
    <S.Trigger
      aria-invalid={invalid || undefined}
      className={cn(
        fieldBox({ invalid, size: fieldSize }),
        "cursor-pointer justify-between [&>span]:min-w-0 [&>span]:truncate data-placeholder:text-muted",
        className,
      )}
      {...props}
    >
      {icon && <span className={cn(fieldIcon, "flex")}>{icon}</span>}
      <span className="flex-1 text-start">{children}</span>
      <S.Icon asChild>
        <ChevronDownIcon
          width={16}
          height={16}
          className={cn(fieldIcon, "transition-transform duration-200 group-data-[state=open]/field:rotate-180")}
        />
      </S.Icon>
    </S.Trigger>
  );
}

export function SelectContent({ className, children, position = "popper", ...props }: ComponentProps<typeof S.Content>) {
  return (
    <S.Portal>
      <S.Content
        position={position}
        sideOffset={8}
        collisionPadding={12}
        className={cn(
          panelClass,
          "relative max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) origin-(--radix-select-content-transform-origin) overflow-hidden",
          className,
        )}
        {...props}
      >
        <S.ScrollUpButton className="flex h-6 items-center justify-center text-muted">
          <ChevronDownIcon width={14} height={14} className="rotate-180" />
        </S.ScrollUpButton>
        <S.Viewport className="max-h-72 scroll-py-1">{children}</S.Viewport>
        <S.ScrollDownButton className="flex h-6 items-center justify-center text-muted">
          <ChevronDownIcon width={14} height={14} />
        </S.ScrollDownButton>
      </S.Content>
    </S.Portal>
  );
}

export function SelectItem({ className, children, ...props }: ComponentProps<typeof S.Item>) {
  return (
    <S.Item
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-2xl py-2.5 ps-3 pe-9 text-sm outline-none select-none transition-colors",
        "data-highlighted:bg-primary-100 data-highlighted:text-primary data-[state=checked]:font-bold data-[state=checked]:text-primary",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <S.ItemText>{children}</S.ItemText>
      <S.ItemIndicator className="absolute end-3 grid size-5 place-items-center rounded-full bg-primary text-white">
        <CheckIcon width={11} height={11} strokeWidth={3} />
      </S.ItemIndicator>
    </S.Item>
  );
}

export function SelectSeparator({ className, ...props }: ComponentProps<typeof S.Separator>) {
  return <S.Separator className={cn("mx-2 my-1 h-px bg-line", className)} {...props} />;
}

/* ---------- Convenience: options in, string value out ---------- */
export interface SelectOption {
  value: string;
  label: ReactNode;
}

/** Radix forbids "" as an item value, so the "clear" item uses this sentinel. */
const CLEAR = "__clear__";

export interface SelectProps {
  id?: string;
  name?: string;
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: ReadonlyArray<SelectOption>;
  placeholder?: string;
  /** Adds the placeholder as the first item so the choice can be reset to "". */
  clearable?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  fieldSize?: FieldSize;
  icon?: ReactNode;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export function Select({ value, onChange, onBlur, options, placeholder, clearable, name, disabled, ref, ...trigger }: SelectProps) {
  const t = useTranslations("common");
  return (
    <SelectRoot
      name={name}
      disabled={disabled}
      value={value ?? ""}
      onValueChange={(v) => onChange(v === CLEAR ? "" : v)}
      onOpenChange={(open) => !open && onBlur?.()}
    >
      <SelectTrigger ref={ref} {...trigger}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {clearable && (
          <>
            <SelectItem value={CLEAR} className="text-muted">
              {placeholder ?? t("clear")}
            </SelectItem>
            <SelectSeparator />
          </>
        )}
        {options.length === 0 && <p className="px-3 py-2.5 text-sm text-muted">{t("noOptions")}</p>}
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
