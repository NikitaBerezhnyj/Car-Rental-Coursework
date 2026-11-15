import { moneyField, textField } from "./fields";
import { z } from "zod";

export const carCategorySchema = z.object({
  name: textField("назву", 50),
  dailyRate: moneyField.refine(value => value > 0, "Тариф має бути більшим за 0")
});
