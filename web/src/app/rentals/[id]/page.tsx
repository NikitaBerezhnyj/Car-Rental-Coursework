import { LoadingState } from "@/components/LoadingState/LoadingState";
import { RentalDetails } from "@/components/RentalDetails/RentalDetails";
import { rentalService } from "@/container";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function RentalDetailsContent({ params }: PageProps) {
  const { id } = await params;
  const rentals = await rentalService.list();

  const rental = rentals.find(item => String(item.id) === id);

  if (!rental) {
    notFound();
  }

  return <RentalDetails rental={rental} />;
}

export default function RentalDetailsPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingState message="Завантаження оренди..." />}>
      <RentalDetailsContent params={params} />
    </Suspense>
  );
}
