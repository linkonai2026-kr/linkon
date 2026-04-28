import AdminConsole from "@/components/admin/admin-console";
import { getAdminOverview, getAdminUserDetail, listAdminUsers } from "@/lib/linkon/admin";
import { requireSuperAdminSession } from "@/lib/linkon/session";

export const metadata = {
  title: "관리자 콘솔",
  description: "Linkon 통합 계정과 서비스 접근 권한을 관리하는 관리자 전용 화면입니다.",
};

export default async function AdminPage() {
  const session = await requireSuperAdminSession();
  let initialError: string | null = null;

  const overview = await getAdminOverview().catch((error) => {
    initialError = error instanceof Error ? error.message : "관리자 대시보드를 불러오지 못했습니다.";
    return null;
  });

  const users = await listAdminUsers().catch((error) => {
    initialError = error instanceof Error ? error.message : "사용자 목록을 불러오지 못했습니다.";
    return [];
  });

  const initialDetail = users[0]
    ? await getAdminUserDetail(users[0].id).catch((error) => {
        initialError = error instanceof Error ? error.message : "사용자 상세 정보를 불러오지 못했습니다.";
        return null;
      })
    : null;

  return (
    <AdminConsole
      overview={overview}
      initialUsers={users}
      initialDetail={initialDetail}
      currentAdminEmail={session.email}
      initialError={initialError}
    />
  );
}
