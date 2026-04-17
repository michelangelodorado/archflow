"use client";

import type { LucideIcon } from "lucide-react";

export function NodeIcon({
  logo,
  FallbackIcon,
  className,
}: {
  logo?: string;
  FallbackIcon: LucideIcon;
  className: string;
}) {
  if (logo) {
    return <img src={logo} alt="" className="w-6 h-6 flex-shrink-0 object-contain" />;
  }
  return <FallbackIcon className={className} />;
}
