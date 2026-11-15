import { createPayment } from "@/actions/paymentActions";
import { PaymentForm } from "@/components/forms/PaymentForm/PaymentForm";
import { LoadingState } from "@/components/ui/LoadingState/LoadingState";
import { rentalService } from "@/container";
import { parseId } from "@/utils/id";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function NewPaymentContent({ params }: PageProps) {
  const { id } = await params;
  const rental = await rentalService.getById(parseId(id));

  if (!rental) {
    notFound();
  }

  return <PaymentForm rental={rental} action={createPayment.bind(null, rental.id)} />;
}

export default function NewPaymentPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingState message="Завантаження оренди..." />}>
      <NewPaymentContent params={params} />
    </Suspense>
  );
}
