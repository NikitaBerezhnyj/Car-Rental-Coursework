import type { IRentalExtraRepository } from "./interfaces/IRentalExtraRepository";
import { query } from "@/lib/db";
import type { RentalExtra } from "@/types/rentalExtra";

type RentalExtraRow = {
  rental_id: number;
  service_id: number;
  extra_name: string;
  price: string;
};

const toRentalExtra = (row: RentalExtraRow): RentalExtra => ({
  id: `${row.rental_id}-${row.service_id}`,
  rentalId: row.rental_id,
  extraName: row.extra_name,
  price: Number(row.price)
});

export class RentalExtraRepository implements IRentalExtraRepository {
  async findByRentalId(rentalId: number): Promise<RentalExtra[]> {
    const rows = await query<RentalExtraRow>(
      `SELECT rs.rental_id, rs.service_id, s.name AS extra_name, rs.price
       FROM rental_services rs
       JOIN additional_services s USING (service_id)
       WHERE rs.rental_id = $1
       ORDER BY s.name`,
      [rentalId]
    );
    return rows.map(toRentalExtra);
  }
}
