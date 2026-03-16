type AlertVariant = "success" | "error" | "info";

interface AlertProps {
  variant: AlertVariant;
  children: React.ReactNode;
  role?: "alert" | "status";
}

const variantClass: Record<AlertVariant, string> = {
  success: "alert--success",
  error: "alert--error",
  info: "alert--info",
};

export function Alert({ variant, children, role = "alert" }: AlertProps) {
  return (
    <div
      className={`alert ${variantClass[variant]}`}
      role={role}
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      {children}
    </div>
  );
}
