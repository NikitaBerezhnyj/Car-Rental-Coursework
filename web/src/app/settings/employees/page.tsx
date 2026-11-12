import { Employees } from "@/components/Employees/Employees";
import { LoadingState } from "@/components/LoadingState/LoadingState";
import { employeeService } from "@/container";
import { Suspense } from "react";

async function EmployeesContent() {
  const employees = await employeeService.list();

  return <Employees employees={employees} />;
}

export default function EmployeesPage() {
  return (
    <Suspense fallback={<LoadingState message="Завантаження працівників..." />}>
      <EmployeesContent />
    </Suspense>
  );
}
