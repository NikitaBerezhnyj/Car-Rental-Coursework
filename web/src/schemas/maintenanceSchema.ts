import { dateField, idField, moneyField, optionalDateField, textField } from "./fields";
import { z } from "zod";

export const maintenanceSchema = z
  .object({
    carId: idField("Оберіть автомобіль"),
    startDate: dateField,
    endDate: optionalDateField,
    description: textField("опис", 200),
    cost: moneyField
  })
  .refine(data => data.endDate === null || data.endDate >= data.startDate, {
    message: "Дата завершення не може бути раніше дати початку",
    path: ["endDate"]
  });
