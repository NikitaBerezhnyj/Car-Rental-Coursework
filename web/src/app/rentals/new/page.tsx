import { createRental } from "@/actions/rentalActions";
import { LoadingState } from "@/components/LoadingState/LoadingState";
import { NewRental } from "@/components/NewRental/NewRental";
import { carService, customerService, employeeService, extraService } from "@/container";
import { addDays, getToday, toIsoDate } from "@/utils/date";
import { connection } from "next/server";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
    customerId?: string;
  }>;
};

async function NewRentalContent({ searchParams }: PageProps) {
  await connection();

  const params = await searchParams;
  const today = getToday();

  const startDate = params.startDate || toIsoDate(today);
  const endDate = params.endDate || toIsoDate(addDays(today, 2));

  const [customers, employees, extras, cars] = await Promise.all([
    customerService.list(),
    employeeService.list(),
    extraService.list(),
    carService.listAvailable(startDate, endDate)
  ]);

  return (
    <NewRental
      customers={customers}
      employees={employees}
      extras={extras}
      cars={cars}
      minDate={toIsoDate(today)}
      initialStartDate={startDate}
      initialEndDate={endDate}
      initialCustomerId={params.customerId}
      action={createRental}
    />
  );
}

export default function NewRentalPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<LoadingState message="Завантаження форми..." />}>
      <NewRentalContent searchParams={searchParams} />
    </Suspense>
  );
}
