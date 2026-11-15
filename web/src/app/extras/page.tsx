import { Extras } from "@/components/screens/Extras/Extras";
import { LoadingState } from "@/components/ui/LoadingState/LoadingState";
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
