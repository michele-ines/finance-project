export const ROUTES = {
  ROOT: "/",
  HOME: "/home",
  ABOUT: "/sobre",
  SERVICES: "/servicos",
  REGISTER: "/cadastro",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/esqueci-senha",
  DASHBOARD: "/dashboard",
  PERSONAL_CARDS: "/meus-cartoes",
  // TRANSFER: "/transferencia",
  INVESTMENTS: "/investments",
  MY_ACCOUNT: "/minha-conta",
  OTHER_SERVICES: "/outros-servicos",
  NOT_FOUND: "/not-found",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
