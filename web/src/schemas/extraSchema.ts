import { moneyField, textField } from "./fields";
import { z } from "zod";

export const extraSchema = z.object({
  name: textField("назву", 50),
  dailyPrice: moneyField.refine(value => value > 0, "Ціна має бути більшою за 0")
});
