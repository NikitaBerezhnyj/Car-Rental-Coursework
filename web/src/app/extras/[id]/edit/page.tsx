import { updateExtra } from "@/actions/extraActions";
import { ExtraForm } from "@/components/forms/ExtraForm/ExtraForm";
import { LoadingState } from "@/components/ui/LoadingState/LoadingState";
import { extraService } from "@/container";
import { parseId } from "@/utils/id";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function EditExtraContent({ params }: PageProps) {
  const { id } = await params;
  const extra = await extraService.getById(parseId(id));

  if (!extra) {
    notFound();
  }

  return <ExtraForm extra={extra} action={updateExtra.bind(null, extra.id)} />;
}

export default function EditExtraPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingState message="Завантаження послуги..." />}>
      <EditExtraContent params={params} />
    </Suspense>
  );
}
