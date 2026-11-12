import type { IExtraRepository } from "@/repositories/interfaces/IExtraRepository";
import type { Extra } from "@/types/extra";

export class ExtraService {
  constructor(private readonly extras: IExtraRepository) {}

  list(): Promise<Extra[]> {
    return this.extras.findAll();
  }
}
