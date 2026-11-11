/* eslint-disable react-refresh/only-export-components */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-label-large font-medium transition-all duration-200 ease-emphasized focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--app-primary-ring-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--app-surface-rgb))] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[rgb(var(--app-primary-rgb))] text-[rgb(var(--app-on-color-rgb))] shadow-[0_6px_16px_rgb(var(--app-primary-rgb)/0.16)] hover:bg-[rgb(var(--app-primary-hover-rgb))]",
        filled:
          "bg-[rgb(var(--app-primary-rgb))] text-[rgb(var(--app-on-color-rgb))] shadow-[0_6px_16px_rgb(var(--app-primary-rgb)/0.16)] hover:bg-[rgb(var(--app-primary-hover-rgb))]",
        elevated:
          "border border-[rgb(var(--app-border-rgb))] bg-[rgb(var(--app-surface-rgb))] text-[rgb(var(--app-ink-rgb))] shadow-[0_8px_18px_rgb(var(--app-shadow-rgb)/0.1)] hover:border-[rgb(var(--app-primary-ring-rgb))] hover:bg-[rgb(var(--app-surface-alt-rgb))]",
        tonal:
          "bg-[rgb(var(--app-primary-soft-rgb))] text-[rgb(var(--app-primary-strong-rgb))] shadow-none hover:bg-[rgb(var(--app-primary-tint-rgb))]",
        outlined:
          "border border-[rgb(var(--app-border-rgb))] bg-[rgb(var(--app-surface-rgb))] text-[rgb(var(--app-text-rgb))] shadow-none hover:bg-[rgb(var(--app-surface-alt-rgb))] hover:text-[rgb(var(--app-ink-rgb))]",
        destructive:
          "bg-[rgb(var(--app-danger-rgb))] text-[rgb(var(--app-on-color-rgb))] shadow-[0_6px_16px_rgb(var(--app-danger-rgb)/0.14)] hover:bg-[rgb(var(--app-danger-hover-rgb))]",
        outline:
          "border border-[rgb(var(--app-border-rgb))] bg-[rgb(var(--app-surface-alt-rgb))] text-[rgb(var(--app-text-rgb))] shadow-none hover:bg-[rgb(var(--app-track-rgb))] hover:text-[rgb(var(--app-ink-rgb))]",
        secondary:
          "bg-[rgb(var(--app-surface-alt-rgb))] text-[rgb(var(--app-text-rgb))] shadow-none hover:bg-[rgb(var(--app-track-rgb))] hover:text-[rgb(var(--app-ink-rgb))]",
        ghost:
          "text-[rgb(var(--app-text-rgb))] hover:bg-[rgb(var(--app-surface-alt-rgb))] hover:text-[rgb(var(--app-ink-rgb))]",
        link:
          "text-[rgb(var(--app-primary-rgb))] dark:text-[rgb(var(--app-primary-strong-rgb))] underline-offset-4 hover:text-[rgb(var(--app-primary-hover-rgb))] dark:hover:text-[rgb(var(--app-primary-strong-rgb))] hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-label-medium",
        lg: "h-12 px-8 text-label-large",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
