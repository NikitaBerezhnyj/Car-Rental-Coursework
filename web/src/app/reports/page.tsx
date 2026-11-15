import { LoadingState } from "@/components/LoadingState/LoadingState";
import { Reports } from "@/components/Reports/Reports";
import { reportService } from "@/container";
import { Suspense } from "react";

async function ReportsContent() {
  const reports = await reportService.getAll();

  return <Reports reports={reports} />;
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<LoadingState message="Формування звітів..." />}>
      <ReportsContent />
    </Suspense>
  );
}
