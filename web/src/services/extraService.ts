import { AppError } from "@/lib/errors";
import { parseOrThrow } from "@/lib/validation";
import type { IExtraRepository } from "@/repositories/interfaces/IExtraRepository";
import { extraSchema } from "@/schemas/extraSchema";
import type { Extra } from "@/types/extra";

const notFound = () => new AppError("Послугу не знайдено", "NOT_FOUND");

export class ExtraService {
  constructor(private readonly extras: IExtraRepository) {}

  list(): Promise<Extra[]> {
    return this.extras.findAll();
  }

  getById(id: number): Promise<Extra | null> {
    return this.extras.findById(id);
  }

  create(input: unknown): Promise<Extra> {
    return this.extras.create(parseOrThrow(extraSchema, input));
  }

  async update(id: number, input: unknown): Promise<Extra> {
    const extra = await this.extras.update(id, parseOrThrow(extraSchema, input));
    if (!extra) throw notFound();
    return extra;
  }

  async remove(id: number): Promise<void> {
    if (!(await this.extras.delete(id))) throw notFound();
  }
}
