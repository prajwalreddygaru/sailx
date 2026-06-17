import { PolicyContent } from "@/components/marketing/policy-content";
import { POLICY_BY_ID } from "@/lib/policies";

export default function VisaPolicyPage() {
  return <PolicyContent policy={POLICY_BY_ID.visa} />;
}
