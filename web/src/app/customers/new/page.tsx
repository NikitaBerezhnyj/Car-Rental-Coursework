import { createCustomer } from "@/actions/customerActions";
import { CustomerForm } from "@/components/CustomerForm/CustomerForm";
import { LoadingState } from "@/components/LoadingState/LoadingState";
import { getSafeReturnPath } from "@/utils/returnTo";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<{
    returnTo?: string;
  }>;
};

async function NewCustomerContent({ searchParams }: PageProps) {
  const { returnTo } = await searchParams;

  return <CustomerForm returnTo={getSafeReturnPath(returnTo)} action={createCustomer} />;
}

export default function NewCustomerPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<LoadingState message="Завантаження форми..." />}>
      <NewCustomerContent searchParams={searchParams} />
    </Suspense>
  );
}
