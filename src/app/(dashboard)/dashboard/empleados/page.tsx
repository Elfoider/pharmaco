import { redirect } from "next/navigation";

export default function EmpleadosLegacyRedirect() {
  redirect("/dashboard/employees");
}
