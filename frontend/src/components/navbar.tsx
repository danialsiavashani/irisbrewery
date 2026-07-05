import { getCurrentUser } from "@/lib/auth";
import { NavbarClient } from "@/components/navbar-client";

export async function Navbar() {
  const user = await getCurrentUser();
  return <NavbarClient user={user} />;
}