// IExtraRepository.ts
import type { Extra } from "@/types/extra";

export interface IExtraRepository {
  findAll(): Promise<Extra[]>;
}
