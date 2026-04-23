import AdminConsole from "@/components/admin/admin-console";
import { getAdminUserDetail, listAdminUsers } from "@/lib/linkon/admin";
import { requireSuperAdminSession } from "@/lib/linkon/session";

export const metadata = {
  title: "Admin Console",
  description:
    "Linkon super admin control for user permissions, status changes, plan updates, deletions, and service synchronization.",
};

export default async function AdminPage() {
  const session = await requireSuperAdminSession();
  const users = await listAdminUsers();
  const initialDetail = users[0] ? await getAdminUserDetail(users[0].id) : null;

  return (
    <AdminConsole
      initialUsers={users}
      initialDetail={initialDetail}
      currentAdminEmail={session.email}
    />
  );
}
