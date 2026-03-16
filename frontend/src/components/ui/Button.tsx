import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "edit" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}


const variantClass: Record<ButtonVariant, string> = {
  primary: "btn--primary",
  secondary: "btn--secondary",
  edit: "btn--edit",
  danger: "btn--danger",
  ghost: "btn--ghost",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "btn--sm",
  md: "btn--md",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    "btn",
    variantClass[variant],
    sizeClass[size],
    fullWidth && "btn--full",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={rest.type ?? "button"}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <span className="btn__spinner" aria-hidden />
          <span className="btn__text">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
