import { Metadata } from "next";
import RegisterForm from "@/components/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create one Linkon account for Vion, Rion, and Taxon access.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
