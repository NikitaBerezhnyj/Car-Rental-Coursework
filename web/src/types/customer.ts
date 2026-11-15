export type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  driverLicense: string;
};

export type CustomerInput = Omit<Customer, "id">;
