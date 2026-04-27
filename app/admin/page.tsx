import AdminConsole from "@/components/admin/admin-console";
import { getAdminUserDetail, listAdminUsers } from "@/lib/linkon/admin";
import { requireSuperAdminSession } from "@/lib/linkon/session";

export const metadata = {
  title: "관리자 콘솔",
  description:
    "Linkon 통합 계정, 권한, 요금제, 서비스 접근, 감사 로그를 관리하는 최고 관리자 콘솔입니다.",
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
