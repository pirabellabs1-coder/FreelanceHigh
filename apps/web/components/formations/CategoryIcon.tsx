"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";

interface CategoryIconProps {
  icon: string | null;
  color?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_MAP = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

export default function CategoryIcon({ icon, color, size = "md", className }: CategoryIconProps) {
  const iconName = icon || "library_books";
  const sizeClass = SIZE_MAP[size];

  return (
    <DynamicIcon
      name={iconName}
      className={className || sizeClass}
      style={color ? { color } : undefined}
    />
  );
}
