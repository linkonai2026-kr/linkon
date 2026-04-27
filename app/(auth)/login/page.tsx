import { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/login-form";

export const metadata: Metadata = {
  title: "로그인",
  description: "Linkon 통합 계정으로 로그인합니다.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-page">
          <div className="auth-card" style={{ textAlign: "center" }}>
            로그인 화면을 불러오는 중...
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
