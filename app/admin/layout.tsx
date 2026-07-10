import { getSessionSafe } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionSafe();

  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-bg-page">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
