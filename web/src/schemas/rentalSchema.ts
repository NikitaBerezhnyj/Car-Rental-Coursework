import { dateField, idField, isValidDate } from "./fields";
import { getToday, parseDate } from "@/utils/date";
import { z } from "zod";

export const rentalSchema = z
  .object({
    customerId: idField("Оберіть клієнта"),
    carId: idField("Оберіть автомобіль"),
    employeeId: idField("Оберіть працівника"),
    startDate: dateField,
    endDate: dateField,
    extraIds: z.array(idField("Некоректна додаткова послуга")).transform(ids => [...new Set(ids)])
  })
  .refine(
    data =>
      !isValidDate(data.startDate) || !isValidDate(data.endDate) || data.endDate >= data.startDate,
    { message: "Дата завершення не може бути раніше початку", path: ["endDate"] }
  )
  .refine(data => !isValidDate(data.startDate) || parseDate(data.startDate) >= getToday(), {
    message: "Дата початку не може бути в минулому",
    path: ["startDate"]
  });
