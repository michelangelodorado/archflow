interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
}

const variantClasses = {
  default: "bg-primary/10 text-primary",
  secondary: "bg-muted text-muted-foreground",
  outline: "border border-border text-foreground",
};

export function Badge({ children, variant = "default", className = "", onClick }: BadgeProps) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors
        ${onClick ? "cursor-pointer hover:opacity-80" : ""}
        ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Comp>
  );
}
