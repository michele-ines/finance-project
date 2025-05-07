// src/app/[...all]/page.tsx
import { redirect } from "next/navigation";
import { ROUTES } from "constants/routes.constant";

export default function CatchAll() {
  redirect(ROUTES.NOT_FOUND);
}
