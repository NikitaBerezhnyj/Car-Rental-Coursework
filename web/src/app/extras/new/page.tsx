import { createExtra } from "@/actions/extraActions";
import { ExtraForm } from "@/components/ExtraForm/ExtraForm";

export default function NewExtraPage() {
  return <ExtraForm action={createExtra} />;
}
