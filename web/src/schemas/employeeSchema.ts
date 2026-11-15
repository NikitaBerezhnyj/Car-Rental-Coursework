import { phoneField, textField } from "./fields";
import { EMPLOYEE_POSITIONS } from "@/types/employee";
import { z } from "zod";

export const employeeSchema = z.object({
  firstName: textField("ім'я", 50),
  lastName: textField("прізвище", 50),
  position: z.enum(EMPLOYEE_POSITIONS, { message: "Оберіть посаду зі списку" }),
  phone: phoneField
});
