import { LoadingState } from "@/components/LoadingState/LoadingState";
import Rentals from "@/components/Rentals/Rentals";
import { rentalService } from "@/container";
import { Suspense } from "react";

async function RentalsContent() {
  const rentals = await rentalService.list();

  return <Rentals rentals={rentals} />;
}

export default function RentalsPage() {
  return (
    <Suspense fallback={<LoadingState message="Завантаження оренд..." />}>
      <RentalsContent />
    </Suspense>
  );
}
