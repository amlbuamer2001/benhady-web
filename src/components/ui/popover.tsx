"use client";
import { Popover as P } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { panelClass } from "./field-styles";

export const Popover = P.Root;
export const PopoverTrigger = P.Trigger;
export const PopoverAnchor = P.Anchor;
export const PopoverClose = P.Close;

export function PopoverContent({ className, align = "start", sideOffset = 8, ...props }: ComponentProps<typeof P.Content>) {
  return (
    <P.Portal>
      <P.Content
        align={align}
        sideOffset={sideOffset}
        collisionPadding={12}
        className={cn(panelClass, "origin-(--radix-popover-content-transform-origin)", className)}
        {...props}
      />
    </P.Portal>
  );
}
