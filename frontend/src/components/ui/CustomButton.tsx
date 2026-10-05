import React, { type ComponentProps } from "react";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-secondary text-on-secondary hover:bg-secondary/90",
  outline:
    "border-2 border-emerald-900 text-emerald-900 hover:bg-emerald-900 hover:text-primary",
  disabled: "border-2 border-stone-300 text-stone-500  hover:text-stone-600",
  ghost: "text-primary hover:bg-emerald-200 hover:text-white",
  danger:
    "bg-error-container text-on-error-container hover:bg-error-container/50",
  tab: "bg-transparent text-primary hover:bg-primary/10",
  "tab-active": "bg-primary text-white",
};

const SIZES = {
  sm: "px-3 py-1.5 body-sm min-h-[38px]",
  md: "px-4 py-2 body-md min-h-[44px]", // Idéal pour le touch-friendly sur mobile
  lg: "px-6 py-3 body-lg min-h-[52px]",
};

interface ButtonProps extends ComponentProps<"button"> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  isLoading?: boolean;
  icon?: React.ReactNode;
}
function CustomButton({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-btn btn-interaction select-none cursor-pointer disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed";
  const variantStyles = VARIANTS[variant];
  const sizeStyles = SIZES[size];
  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {/* Indicateur de chargement (Spinner) */}
      {isLoading && (
        <span className="mr-2 animate-spin border-2 border-current border-t-transparent rounded-full w-4 height-4" />
      )}
      {/* Texte du bouton */}
      <span>{children}</span>

      {/* Icône optionnelle (ex: FontAwesome) */}
      {!isLoading && icon && <span className="inline-flex ml-2">{icon}</span>}
    </button>
  );
}

export default CustomButton;
