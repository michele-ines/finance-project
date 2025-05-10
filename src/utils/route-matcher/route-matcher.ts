import { ROUTES } from "config-routes/routes";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HeaderFlags } from "interfaces/dashboard";


/* --- grupos de rotas --- */
// Rotas que exibem SÓ links públicos + fundo preto (exceto 404, que não mostra nem links)
const publicOnlyRoutes: string[] = [
  ROUTES.ROOT,
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.SERVICES,
  ROUTES.REGISTER,
  ROUTES.LOGIN,
  // ROUTES.TRANSFER,  
  ROUTES.FORGOT_PASSWORD,  
];

// Rotas internas (após login) + fundo dash
const internalOnlyRoutes: string[] = [
  ROUTES.DASHBOARD,
  ROUTES.PERSONAL_CARDS,
  // ROUTES.TRANSFER,
  ROUTES.INVESTMENTS,
  ROUTES.MY_ACCOUNT,
  ROUTES.OTHER_SERVICES,
];

/* ---------- helpers de rota ---------- */
export const isHomeRoute = (p: string) =>  p === ROUTES.ROOT || p === ROUTES.HOME;
export const isAboutRoute = (p: string) => p.startsWith(ROUTES.ABOUT);
export const isServicesRoute = (p: string) => p.startsWith(ROUTES.SERVICES);
export const isRegisterRoute = (p: string) => p === ROUTES.REGISTER;
export const isLoginRoute = (p: string) => p === ROUTES.LOGIN;
export const isForgotPasswordRoute = (p: string) => p === ROUTES.FORGOT_PASSWORD;
export const isDashboardRoute = (p: string) => p.startsWith(ROUTES.DASHBOARD);
export const isPersonalRoute = (p: string) => p.startsWith(ROUTES.PERSONAL_CARDS);
// export const isTransferRoute = (p: string) => p.startsWith(ROUTES.TRANSFER);
export const isInvestmentsRoute = (p: string) => p.startsWith(ROUTES.INVESTMENTS);
export const isMyAccountRoute = (p: string) => p.startsWith(ROUTES.MY_ACCOUNT);
export const isOtherServicesRoute = (p: string) => p.startsWith(ROUTES.OTHER_SERVICES);

/* --- rotas com comportamento especial --- */
// Rota 404: esconder tudo e fundo preto
export const isNotFoundRoute = (p: string) => p === ROUTES.NOT_FOUND;

export const isPublicOnlyRoute = (pathname: string) =>
  publicOnlyRoutes.includes(pathname);

export const isInternalOnlyRoute = (pathname: string) =>
  internalOnlyRoutes.some((r) => pathname.startsWith(r));

/* ---------- flags do header ---------- */
export const getHeaderFlags = (pathname: string): HeaderFlags => {
  // em 404, esconder tudo
  if (isNotFoundRoute(pathname)) {
    return {
      isHome: false,
      isDashboard: false,
      isInvestments: false,
      showPublicLinks: false,
      showInternalLinks: false,
      showDashboardBtn: false,
    };
  }

  return {
    isHome: isHomeRoute(pathname),
    isDashboard: isDashboardRoute(pathname),
    isInvestments: isInvestmentsRoute(pathname),
    showPublicLinks: isPublicOnlyRoute(pathname),
    showInternalLinks: isInternalOnlyRoute(pathname),
    showDashboardBtn: !isInternalOnlyRoute(pathname),
  };
};

export const useHeaderFlags = (): HeaderFlags => {
  const pathname = usePathname();
  return useMemo(() => getHeaderFlags(pathname), [pathname]);
};

/* --- cores de fundo --- */
export const ByteColor = {
  dash: "var(--byte-color-dash)",
  black: "var(--byte-color-black)",
} as const;
export type ByteColor = (typeof ByteColor)[keyof typeof ByteColor];

export const getBgColor = (pathname: string): ByteColor => {
  // 404 sempre preto
  if (isNotFoundRoute(pathname)) {
    return ByteColor.black;
  }
  // rotas públicas têm fundo preto, internas têm dash
  return isPublicOnlyRoute(pathname) ? ByteColor.black : ByteColor.dash;
};

export const useBgColor = (): ByteColor => {
  const pathname = usePathname();
  return useMemo(() => getBgColor(pathname), [pathname]);
};
