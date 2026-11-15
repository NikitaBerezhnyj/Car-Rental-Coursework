import { updateCarCategory } from "@/actions/carCategoryActions";
import { CarCategoryForm } from "@/components/forms/CarCategoryForm/CarCategoryForm";
import { LoadingState } from "@/components/ui/LoadingState/LoadingState";
import { carCategoryService } from "@/container";
import { parseId } from "@/utils/id";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function EditCarCategoryContent({ params }: PageProps) {
  const { id } = await params;
  const category = await carCategoryService.getById(parseId(id));

  if (!category) {
    notFound();
  }

  return <CarCategoryForm category={category} action={updateCarCategory.bind(null, category.id)} />;
}

export default function EditCarCategoryPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingState message="Завантаження категорії..." />}>
      <EditCarCategoryContent params={params} />
    </Suspense>
  );
}
