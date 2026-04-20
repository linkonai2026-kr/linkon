import { Metadata } from "next";
import RegisterForm from "@/components/register-form";

export const metadata: Metadata = {
  title: "회원가입",
  description: "Linkon 통합 회원가입 — 한 번 가입으로 Vion, Rion, Taxon을 모두 이용하세요.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
