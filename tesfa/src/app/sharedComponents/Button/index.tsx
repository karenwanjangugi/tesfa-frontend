import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "link";
  size?: "default" | "sm" | "lg" ;
  className?: string;
}

const variantClasses = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  link: "text-primary underline-offset-4 hover:underline"
};

const sizeClasses = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md gap-1.5 px-3",
  lg: "h-10 rounded-md px-6",
};

export function Button({
  variant = "default",
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
  const combinedClassName = `${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  return <button className={combinedClassName} {...props} />;
}
