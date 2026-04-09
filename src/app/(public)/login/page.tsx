import { LoginBackground } from "@/components/auth/login-background";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <LoginBackground />
      <LoginForm />
    </section>
  );
}
