import { CarCategoryRepository } from "@/repositories/carCategoryRepository";
import { CarRepository } from "@/repositories/carRepository";
import { CustomerRepository } from "@/repositories/customerRepository";
import { EmployeeRepository } from "@/repositories/employeeRepository";
import { ExtraRepository } from "@/repositories/extraRepository";
import { MaintenanceRepository } from "@/repositories/maintenanceRepository";
import { PaymentRepository } from "@/repositories/paymentRepository";
import { RentalExtraRepository } from "@/repositories/rentalExtraRepository";
import { RentalRepository } from "@/repositories/rentalRepository";
import { CarCategoryService } from "@/services/carCategoryService";
import { CarService } from "@/services/carService";
import { CustomerService } from "@/services/customerService";
import { EmployeeService } from "@/services/employeeService";
import { ExtraService } from "@/services/extraService";
import { MaintenanceService } from "@/services/maintenanceService";
import { PaymentService } from "@/services/paymentService";
import { RentalExtraService } from "@/services/rentalExtraService";
import { RentalService } from "@/services/rentalService";

export const carCategoryService = new CarCategoryService(
  new CarCategoryRepository(),
);
export const carService = new CarService(new CarRepository());
export const customerService = new CustomerService(new CustomerRepository());
export const employeeService = new EmployeeService(new EmployeeRepository());
export const extraService = new ExtraService(new ExtraRepository());
export const maintenanceService = new MaintenanceService(
  new MaintenanceRepository(),
);
export const paymentService = new PaymentService(new PaymentRepository());
export const rentalExtraService = new RentalExtraService(
  new RentalExtraRepository(),
);
export const rentalService = new RentalService(new RentalRepository());
