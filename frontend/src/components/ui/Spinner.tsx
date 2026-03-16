interface SpinnerProps {
  size?: "sm" | "md";
  label?: string;
}

export function Spinner({ size = "md", label = "Carregando" }: SpinnerProps) {
  return (
    <div className="spinner-wrap" role="status" aria-label={label}>
      <span className={`spinner spinner--${size}`} aria-hidden />
      {label && <span className="spinner-wrap__label">{label}</span>}
    </div>
  );
}
