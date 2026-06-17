import { PolicyContent } from "@/components/marketing/policy-content";
import { POLICY_BY_ID } from "@/lib/policies";

export default function PaymentPolicyPage() {
  return <PolicyContent policy={POLICY_BY_ID.payment} />;
}
