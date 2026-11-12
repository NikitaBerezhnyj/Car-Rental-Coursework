import { Extras } from "@/components/Extras/Extras";
import { LoadingState } from "@/components/LoadingState/LoadingState";
import { extraService } from "@/container";
import { Suspense } from "react";

async function ExtrasContent() {
  const extras = await extraService.list();

  return <Extras extras={extras} />;
}

export default function ExtrasPage() {
  return (
    <Suspense fallback={<LoadingState message="Завантаження додаткових послуг..." />}>
      <ExtrasContent />
    </Suspense>
  );
}
