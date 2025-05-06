export const ROUTES = {
  ROOT: "/",
  HOME: "/home",
  DASHBOARD: "/dashboard",
  INVESTMENTS: "/investments",
  MY_CARDS: "/meus-cartoes",
  NOT_FOUND: "/not-found",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];