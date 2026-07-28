import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import { Link } from "react-router-dom";

import { cn } from "../../lib/cn";

type SharedProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

type AnchorProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className" | "href" | "onClick"> & {
    className?: string;
    href: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
  };

type NativeButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "href" | "onClick"> & {
    className?: string;
    href?: never;
    onClick?: MouseEventHandler<HTMLButtonElement>;
  };

type Props = AnchorProps | NativeButtonProps;

function hasHref(props: Props): props is AnchorProps {
  return typeof props.href === "string";
}

const styles = {
  primary: "bg-aic-blue text-white hover:bg-aic-navy hover:ring-2 hover:ring-white/20 shadow-light",
  secondary:
    "bg-aic-gold text-aic-ink hover:bg-aic-gold-dark hover:text-aic-ink shadow-light transition-colors",
  ghost:
    "border border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white backdrop-blur-sm shadow-light",
};

function buttonClasses(className: string | undefined, variant: SharedProps["variant"] = "primary") {
  return cn(
    "inline-flex min-h-11 items-center justify-center rounded-lg px-6 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aic-blue focus-visible:ring-offset-2 motion-reduce:transition-none",
    styles[variant],
    className,
  );
}

function NativeButton({
  children,
  className,
  variant = "primary",
  onClick,
  ...buttonProps
}: NativeButtonProps) {
  return (
    <button {...buttonProps} className={buttonClasses(className, variant)} onClick={onClick}>
      {children}
    </button>
  );
}

export function Button(props: Props) {
  if (!hasHref(props)) return <NativeButton {...props} />;

  const { children, className, variant = "primary", href, onClick, ...anchorProps } = props;
  const classes = buttonClasses(className, variant);

  if (href.startsWith("/")) {
    return (
      <Link {...anchorProps} className={classes} to={href} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a {...anchorProps} className={classes} href={href} onClick={onClick}>
      {children}
    </a>
  );
}
