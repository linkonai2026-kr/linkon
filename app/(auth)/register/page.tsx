import { Metadata } from "next";
import { Suspense } from "react";
import RegisterForm from "@/components/register-form";

export const metadata: Metadata = {
  title: "회원가입",
  description:
    "Vion, Rion, Taxon을 이용하기 위한 Linkon 통합 계정을 만듭니다.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-page">
          <div className="auth-card" style={{ textAlign: "center" }}>
            회원가입 화면을 불러오는 중...
          </div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
