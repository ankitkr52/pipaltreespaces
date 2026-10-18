// Primary CTA (gold pill), secondary outline, ghost. Keep count low on purpose —
// three variants cover the whole site.

import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  leading?: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold " +
  "transition-colors duration-hover motion-safe:active:scale-[0.98] motion-safe:transition-transform " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base " +
  "disabled:opacity-50 disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  md: "h-11 min-w-11 px-5 text-btn-m md:text-btn-d",
  sm: "h-10 min-w-10 px-4 text-meta-m md:text-meta-d",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-gold text-bg-base rounded-full hover:bg-brand-gold-hover",
  secondary:
    "bg-transparent text-brand-gold border border-brand-gold rounded-full " +
    "hover:bg-brand-gold hover:text-bg-base",
  ghost:
    "bg-transparent text-text-primary rounded-lg hover:bg-bg-raised",
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };
type LinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string };
type Props = ButtonProps | LinkProps;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(function Button(
  { variant = "primary", size = "md", leading, trailing, children, className, ...rest },
  ref
) {
  const cls = cx(base, sizes[size], variants[variant], className);
  const content = (
    <>
      {leading}
      {children}
      {trailing}
    </>
  );
  if ("as" in rest && rest.as === "a") {
    const { as: _as, ...a } = rest;
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} className={cls} {...a}>
        {content}
      </a>
    );
  }
  const { as: _as, ...b } = rest as ButtonProps;
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} className={cls} {...b}>
      {content}
    </button>
  );
});
