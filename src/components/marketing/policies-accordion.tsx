"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  ShieldAlert,
  Receipt,
  Stamp,
} from "lucide-react";
import { POLICIES, type PolicyId } from "@/lib/policies";

const POLICY_ICONS: Record<PolicyId, React.ElementType> = {
  payment: CreditCard,
  cancellation: ShieldAlert,
  refund: Receipt,
  visa: Stamp,
};

export function PoliciesAccordion({ compact = true }: { compact?: boolean }) {
  const [openPolicy, setOpenPolicy] = React.useState<PolicyId | null>(null);

  return (
    <div className="p-4 space-y-2">
      {POLICIES.map((policy) => {
        const Icon = POLICY_ICONS[policy.id];
        const isOpen = openPolicy === policy.id;

        return (
          <div key={policy.id}>
            <button
              type="button"
              onClick={() => setOpenPolicy(isOpen ? null : policy.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border hover:bg-primary/5 transition-colors text-left text-sm"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-red-600" />
                <span className="font-semibold">{policy.title}</span>
              </div>
              {isOpen ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            {isOpen && (
              <div
                className={
                  compact
                    ? "px-3 pb-2 pt-2 text-xs space-y-2 text-muted-foreground"
                    : "px-3 pb-3 pt-2 text-sm space-y-3 text-muted-foreground"
                }
              >
                {policy.intro && <p>{policy.intro}</p>}

                {policy.sections.map((section, i) => (
                  <div key={i} className="space-y-1.5">
                    {section.title && (
                      <p className="font-semibold text-foreground/80">{section.title}</p>
                    )}
                    {section.paragraphs?.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                    {section.bullets && (
                      <ul className="list-disc pl-4 space-y-1">
                        {section.bullets.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {section.note && (
                      <p className="text-red-500 font-medium">
                        Important Note: {section.note}
                      </p>
                    )}
                  </div>
                ))}

                {policy.closing && <p>{policy.closing}</p>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
