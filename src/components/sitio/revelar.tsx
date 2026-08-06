"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  retraso?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "header";
};

/** Aparición al entrar en pantalla: sutil, una sola vez, sin bloquear nada. */
export function Revelar({ children, retraso = 0, y = 18, className, as = "div" }: Props) {
  const reducido = useReducedMotion();
  const Comp = motion[as];

  if (reducido) {
    const Plano = as;
    return <Plano className={className}>{children}</Plano>;
  }

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, delay: retraso, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </Comp>
  );
}
