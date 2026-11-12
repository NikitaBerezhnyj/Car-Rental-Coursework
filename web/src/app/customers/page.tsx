import { Customers } from "@/components/Customers/Customers";
import { LoadingState } from "@/components/LoadingState/LoadingState";
import { customerService } from "@/container";
import { Suspense } from "react";

async function CustomersContent() {
  const customers = await customerService.list();

  return <Customers customers={customers} />;
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<LoadingState message="Завантаження клієнтів..." />}>
      <CustomersContent />
    </Suspense>
  );
}
