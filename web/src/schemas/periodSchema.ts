import { dateField } from "./fields";
import { z } from "zod";

export const periodSchema = z
  .object({
    startDate: dateField,
    endDate: dateField
  })
  .refine(period => period.endDate >= period.startDate);
