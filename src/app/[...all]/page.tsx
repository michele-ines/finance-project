import { ROUTES } from "config-routes/routes";
import { redirect } from "next/navigation";

export default function CatchAll() {
  redirect(ROUTES.NOT_FOUND);
}
