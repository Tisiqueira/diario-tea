"use client";

import React, { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

// Função simples para juntar classes
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Variantes do botão
const buttonVariants = {
  default: "bg-primary text-white hover:bg-primary/90",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline hover:underline",
};

const sizeVariants = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-8",
  icon: "h-10 w-10",
};

const Button = forwardRef(function Button(
  {
    className,
    variant = "default",
    size = "default",
    asChild = false,
    children,
    ...props
  },
  ref
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={cn(
        buttonVariants[variant] || buttonVariants.default,
        sizeVariants[size] || sizeVariants.default,
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});

Button.displayName = "Button";

export { Button };
