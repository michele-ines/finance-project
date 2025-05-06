import { ROUTES } from "constants/routes.constant";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HeaderFlags } from "types/dashboard";

// Novos grupos de rotas
const publicOnlyRoutes = [ROUTES.ROOT, ROUTES.HOME, ROUTES.NOT_FOUND];
const internalOnlyRoutes = [
  ROUTES.DASHBOARD,
  ROUTES.INVESTMENTS,
  ROUTES.MY_CARDS,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.SERVICES,
  ROUTES.ACCOUNT,
  ROUTES.OTHER_SERVICES,
];

/* ---------- helpers de rota isolados ---------- */
export const isDashboardRoute = (p: string) => p.startsWith(ROUTES.DASHBOARD);
export const isInvestmentsRoute = (p: string) => p.startsWith(ROUTES.INVESTMENTS);
export const isHomeRoute = (p: string) => p === ROUTES.ROOT || p.startsWith(ROUTES.HOME);
export const isLoginRoute = (p: string) => p.startsWith(ROUTES.LOGIN);
export const isRegisterRoute = (p: string) => p.startsWith(ROUTES.REGISTER);
export const isServicesRoute = (p: string) => p.startsWith(ROUTES.SERVICES);
export const isAccountRoute = (p: string) => p.startsWith(ROUTES.ACCOUNT);
export const isOtherServicesRoute = (p: string) => p.startsWith(ROUTES.OTHER_SERVICES);


export const isMatchingRoute = (pathname: string, routes: string[]) =>
  routes.some(r => pathname.startsWith(r));

export const isPublicOnlyRoute = (pathname: string) =>
  publicOnlyRoutes.some(route => pathname === route);

export const isInternalOnlyRoute = (pathname: string) =>
  internalOnlyRoutes.some(route => pathname.startsWith(route));

export const getHeaderFlags = (pathname: string): HeaderFlags => {
  return {
    isHome: isHomeRoute(pathname),
    isDashboard: isDashboardRoute(pathname),
    isInvestments: isInvestmentsRoute(pathname),
    showPublicLinks: isPublicOnlyRoute(pathname),
    showInternalLinks: isInternalOnlyRoute(pathname),
    showDashboardBtn: !isInternalOnlyRoute(pathname),
  } as const;
};

export const useHeaderFlags = (): HeaderFlags => {
  const pathname = usePathname();
  return useMemo(() => getHeaderFlags(pathname), [pathname]);
};

export const ByteColor = {
  dash: "var(--byte-color-dash)",
  black: "var(--byte-color-black)",
} as const;

export type ByteColor = (typeof ByteColor)[keyof typeof ByteColor];

export const getBgColor = (pathname: string): ByteColor => {
  if (isInternalOnlyRoute(pathname)) return ByteColor.dash;
  return ByteColor.black;
};

export const useBgColor = (): ByteColor => {
  const pathname = usePathname();
  return useMemo(() => getBgColor(pathname), [pathname]);
};
