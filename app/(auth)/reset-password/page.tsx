import { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordForm from "@/components/reset-password-form";

export const metadata: Metadata = {
  title: "새 비밀번호 설정",
  description: "Linkon 통합 계정의 새 비밀번호를 설정합니다.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-page">
          <div className="auth-card" style={{ textAlign: "center" }}>
            로딩 중...
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
