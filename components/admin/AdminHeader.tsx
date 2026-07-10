"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export function AdminHeader({
  title,
  email,
}: {
  title: string;
  email?: string | null;
}) {
  const router = useRouter();

  async function logout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Signed out");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  }

  return (
    <header className="flex items-center justify-between border-b-[3px] border-ink bg-gold px-4 py-4 sm:px-6">
      <div>
        <h1 className="font-display text-xl uppercase text-ink sm:text-2xl">
          {title}
        </h1>
        {email && (
          <p className="text-xs font-bold uppercase tracking-wide text-ink/70">
            {email}
          </p>
        )}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={logout}>
        Log out
      </Button>
    </header>
  );
}
