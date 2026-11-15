import { createCarCategory } from "@/actions/carCategoryActions";
import { CarCategoryForm } from "@/components/CarCategoryForm/CarCategoryForm";

export default function NewCarCategoryPage() {
  return <CarCategoryForm action={createCarCategory} />;
}
