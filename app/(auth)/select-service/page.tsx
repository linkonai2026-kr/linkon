import { Metadata } from "next";
import { Suspense } from "react";
import SelectServiceClient from "@/components/select-service-client";

export const metadata: Metadata = {
  title: "Choose a Service",
  description:
    "Your Linkon account is ready. Choose the service you want to open.",
};

export default function SelectServicePage() {
  return (
    <Suspense
      fallback={
        <div className="auth-page">
          <div className="auth-card" style={{ textAlign: "center" }}>
            Loading service access...
          </div>
        </div>
      }
    >
      <SelectServiceClient />
    </Suspense>
  );
}
