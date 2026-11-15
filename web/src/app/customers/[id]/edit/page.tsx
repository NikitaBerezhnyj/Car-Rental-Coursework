import { updateCustomer } from "@/actions/customerActions";
import { CustomerForm } from "@/components/forms/CustomerForm/CustomerForm";
import { LoadingState } from "@/components/ui/LoadingState/LoadingState";
import { customerService } from "@/container";
import { parseId } from "@/utils/id";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function EditCustomerContent({ params }: PageProps) {
  const { id } = await params;
  const customer = await customerService.getById(parseId(id));

  if (!customer) {
    notFound();
  }

  return <CustomerForm customer={customer} action={updateCustomer.bind(null, customer.id)} />;
}

export default function EditCustomerPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingState message="Завантаження клієнта..." />}>
      <EditCustomerContent params={params} />
    </Suspense>
  );
}
