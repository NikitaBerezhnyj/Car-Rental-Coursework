import { LoadingState } from "@/components/LoadingState/LoadingState";
import { Payments } from "@/components/Payments/Payments";
import { paymentService, rentalService } from "@/container";
import { Suspense } from "react";

async function PaymentsContent() {
  const [payments, rentals] = await Promise.all([paymentService.list(), rentalService.list()]);

  return <Payments payments={payments} rentals={rentals} />;
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={<LoadingState message="Завантаження оплат..." />}>
      <PaymentsContent />
    </Suspense>
  );
}
