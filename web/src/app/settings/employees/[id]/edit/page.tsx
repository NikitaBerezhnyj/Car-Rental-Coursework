import { updateEmployee } from "@/actions/employeeActions";
import { EmployeeForm } from "@/components/EmployeeForm/EmployeeForm";
import { LoadingState } from "@/components/LoadingState/LoadingState";
import { employeeService } from "@/container";
import { parseId } from "@/utils/id";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function EditEmployeeContent({ params }: PageProps) {
  const { id } = await params;
  const employee = await employeeService.getById(parseId(id));

  if (!employee) {
    notFound();
  }

  return <EmployeeForm employee={employee} action={updateEmployee.bind(null, employee.id)} />;
}

export default function EditEmployeePage({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingState message="Завантаження працівника..." />}>
      <EditEmployeeContent params={params} />
    </Suspense>
  );
}
