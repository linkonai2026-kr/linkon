import { Metadata } from "next";
import { Suspense } from "react";
import ForgotPasswordForm from "@/components/forgot-password-form";

export const metadata: Metadata = {
  title: "비밀번호 찾기",
  description: "Linkon 통합 계정 비밀번호를 재설정합니다.",
};

export default function ForgotPasswordPage() {
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
      <ForgotPasswordForm />
    </Suspense>
  );
}
