"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginShell />}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setError("");
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Welcome back");
      router.push(searchParams.get("callbackUrl") || "/admin");
      router.refresh();
    } catch {
      setError("Network error");
    }
  }

  return (
    <LoginShell>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <Input
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          id="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        {error && (
          <p
            className="border-2 border-ink bg-danger-extreme px-3 py-2 text-sm font-bold text-white"
            role="alert"
          >
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </LoginShell>
  );
}

function LoginShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-md border-[3px] border-ink bg-bg-page p-8 shadow-[8px_8px_0_0_#f4c430]">
        <span className="brutal-stamp mx-auto block w-fit bg-gold text-ink">
          BhootKosh
        </span>
        <h1 className="mt-4 text-center font-display text-3xl uppercase text-ink">
          Admin Login
        </h1>
        <p className="mt-2 text-center font-serif text-sm text-muted">
          Secure access to the archive dashboard
        </p>
        {children}
      </div>
    </div>
  );
}
