import { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/login-form";

export const metadata: Metadata = {
  title: "로그인",
  description: "Linkon 계정으로 로그인하세요.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-card" style={{ textAlign: "center" }}>로딩 중...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
