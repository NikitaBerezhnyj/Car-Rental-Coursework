import { createEmployee } from "@/actions/employeeActions";
import { EmployeeForm } from "@/components/EmployeeForm/EmployeeForm";

export default function NewEmployeePage() {
  return <EmployeeForm action={createEmployee} />;
}
