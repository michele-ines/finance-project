// src/app/[...all]/page.tsx
import { redirect } from "next/navigation";
import { ROUTES } from "config-routes/routes";

export default function CatchAll() {
  redirect(ROUTES.NOT_FOUND);
}
