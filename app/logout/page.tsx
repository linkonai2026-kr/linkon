import { Metadata } from "next";
import { Suspense } from "react";
import LogoutClient from "./logout-client";

export const metadata: Metadata = {
  title: "로그아웃",
  description: "Linkon 계정을 로그아웃합니다.",
};

export default function LogoutPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-page">
          <div className="auth-card" style={{ textAlign: "center" }}>
            로그아웃 중...
          </div>
        </div>
      }
    >
      <LogoutClient />
    </Suspense>
  );
}
