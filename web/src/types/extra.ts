export type Extra = {
  id: number;
  name: string;
  dailyPrice: number;
};

export type ExtraInput = Omit<Extra, "id">;
