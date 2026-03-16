import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section";
}

export function Card({ as: Component = "div", className = "", children, ...rest }: CardProps) {
  return (
    <Component className={`card ${className}`.trim()} {...rest}>
      {children}
    </Component>
  );
}
