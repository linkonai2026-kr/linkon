import { Metadata } from "next";
import SelectServiceClient from "@/components/select-service-client";

export const metadata: Metadata = {
  title: "서비스 선택",
  description: "가입이 완료되었습니다! 이용할 서비스를 선택하세요.",
};

export default function SelectServicePage() {
  return <SelectServiceClient />;
}
