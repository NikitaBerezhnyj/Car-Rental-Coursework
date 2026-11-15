import { RentalDetails } from "@/components/screens/RentalDetails/RentalDetails";
import { LoadingState } from "@/components/ui/LoadingState/LoadingState";
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
  const rentalId = Number(id);

  if (!Number.isInteger(rentalId)) {
    notFound();
  }

  const rental = await rentalService.getById(rentalId);

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
