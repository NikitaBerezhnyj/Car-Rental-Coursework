import { CarCategories } from "@/components/screens/CarCategories/CarCategories";
import { LoadingState } from "@/components/ui/LoadingState/LoadingState";
import { carCategoryService } from "@/container";
import { Suspense } from "react";

async function CarCategoriesContent() {
  const categories = await carCategoryService.list();

  return <CarCategories categories={categories} />;
}

export default function CarCategoriesPage() {
  return (
    <Suspense fallback={<LoadingState message="Завантаження категорій..." />}>
      <CarCategoriesContent />
    </Suspense>
  );
}
