import { Metadata } from "next";
import { Suspense } from "react";
import SelectServiceClient from "@/components/select-service-client";

export const metadata: Metadata = {
  title: "서비스 선택",
  description:
    "Linkon 계정이 준비되었습니다. 이용할 서비스를 선택하세요.",
};

export default function SelectServicePage() {
  return (
    <Suspense
      fallback={
        <div className="auth-page">
          <div className="auth-card" style={{ textAlign: "center" }}>
            서비스 정보를 불러오는 중...
          </div>
        </div>
      }
    >
      <SelectServiceClient />
    </Suspense>
  );
}
