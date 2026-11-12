import { RentalDetails } from "@/components/RentalDetails/RentalDetails";
import { rentalService } from "@/container";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RentalDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const rentals = await rentalService.list();

  const rental = rentals.find(item => String(item.id) === id);

  if (!rental) {
    notFound();
  }

  return <RentalDetails rental={rental} />;
}
