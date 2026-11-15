import type { Extra, ExtraInput } from "@/types/extra";

export interface IExtraRepository {
  findAll(): Promise<Extra[]>;
  findById(id: number): Promise<Extra | null>;
  create(data: ExtraInput): Promise<Extra>;
  update(id: number, data: ExtraInput): Promise<Extra | null>;
  delete(id: number): Promise<boolean>;
}
