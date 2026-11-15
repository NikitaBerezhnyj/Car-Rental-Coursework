export type CarCategory = {
  id: number;
  name: string;
  dailyRate: number;
};

export type CarCategoryInput = Omit<CarCategory, "id">;
