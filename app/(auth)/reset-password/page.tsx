import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/reset-password-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "비밀번호 재설정",
  description: "Linkon 통합 계정의 새 비밀번호를 설정합니다.",
};

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  // recovery 세션 확인. 콜백 라우트에서 코드 교환 후 진입한 경우 유효.
  let hasSession = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    hasSession = Boolean(user);
  } catch {
    hasSession = false;
  }

  if (!hasSession) {
    redirect("/login?error=auth_callback_expired");
  }

  return (
    <Suspense
      fallback={
        <div className="auth-page">
          <div className="auth-card" style={{ textAlign: "center" }}>
            화면을 불러오는 중...
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
