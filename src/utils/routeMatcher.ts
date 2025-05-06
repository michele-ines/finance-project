import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HeaderFlags } from "types/dashboard";

/* ---------- helpers de rota isolados ---------- */
export const isDashboardRoute   = (p: string) => p.startsWith("/dashboard");
export const isInvestmentsRoute = (p: string) => p.startsWith("/investments");
export const isHomeRoute        = (p: string) => p === "/" || p.startsWith("/home");

/** Função pura — boa para SSR ou testes */
export const getHeaderFlags = (pathname: string): HeaderFlags => {
  const isDashboard   = isDashboardRoute(pathname);
  const isInvestments = isInvestmentsRoute(pathname);
  const isHome        = isHomeRoute(pathname);

  return {
    isHome,
    isDashboard,
    isInvestments,
    showPublicLinks:   isHome,
    showInternalLinks: isDashboard || isInvestments,
    showDashboardBtn: !(isDashboard || isInvestments),
  } as const;
};

/** Hook para client components — evita repetir usePathname */
export const useHeaderFlags = (): HeaderFlags => {
  const pathname = usePathname();
  return useMemo(() => getHeaderFlags(pathname), [pathname]);
};

export const ByteColor = {
  dash:  "var(--byte-color-dash)",
  black: "var(--byte-color-black)",
} as const;
export type ByteColor = (typeof ByteColor)[keyof typeof ByteColor];

export const isMatchingRoute = (pathname: string, routes: string[]) =>
  routes.some(r => pathname.startsWith(r));

export const isInternalRoute = (pathname: string) =>
  isMatchingRoute(pathname, ["/dashboard", "/investments", "/meus-cartoes"]);

export const isHomeOrPublicRoute = (pathname: string) =>
  pathname === "/" || pathname === "/not-found" || pathname.startsWith("/home");

export const getBgColor = (pathname: string): ByteColor => {
  if (isInternalRoute(pathname))     return ByteColor.dash;
  if (isHomeOrPublicRoute(pathname)) return ByteColor.black;
  return ByteColor.black;
};

export const useBgColor = (): ByteColor => {
  const pathname = usePathname();
  return useMemo(() => getBgColor(pathname), [pathname]);
};
