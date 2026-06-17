export type PolicyId = "payment" | "cancellation" | "refund" | "visa";

export type PolicySection = {
  title?: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
};

export type Policy = {
  id: PolicyId;
  title: string;
  intro?: string;
  sections: PolicySection[];
  closing?: string;
};

export const POLICIES: Policy[] = [
  {
    id: "payment",
    title: "Payment Policy",
    intro: "A booking amount is required to reserve a seat.",
    sections: [
      {
        title: "Standard payment structure",
        bullets: [
          "Booking Amount: ₹30,000 per person",
          "Second Payment: Before visa processing, hotel blocking or major tour arrangements",
          "Balance Payment: 20 days before departure",
        ],
      },
      {
        paragraphs: [
          "Seat confirmation is subject to payment and document submission.",
        ],
        note: "The booking amount becomes non-refundable once visa processing, hotel blocking, invitation support, coordination work or tour arrangements begin.",
      },
      {
        paragraphs: [
          "Failure to complete payment within the required timeline may result in cancellation of the booking.",
          "Bank charges, payment gateway charges, tax charges, transfer charges or currency conversion charges, if applicable, shall be borne by the participant.",
        ],
      },
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation Policy",
    sections: [
      {
        bullets: [
          "All cancellation requests must be submitted in writing.",
          "Cancellation before visa processing or tour arrangements begin may be eligible for refund after deducting administrative and service charges.",
          "Cancellation after visa processing begins will result in deduction of visa-related fees, documentation charges, service charges and administrative costs.",
          "Cancellation after hotel, transport, restaurant, local services or group arrangements are blocked will result in deduction of all non-recoverable expenses and service charges.",
          "Cancellation within 20 days of departure may result in no refund, except any amount recoverable from vendors after deductions.",
          "Cancellation after the tour has started is not eligible for refund.",
        ],
      },
    ],
  },
  {
    id: "refund",
    title: "Refund Policy",
    sections: [
      {
        bullets: [
          "Refunds, if applicable, will be processed only after deducting actual expenses, service charges, administrative charges, vendor cancellation charges, bank charges, payment gateway charges and any non-recoverable costs.",
          "No refund shall be provided for unused services, missed visits, missed transfers, missed meals, late arrivals, early departures, personal cancellations, personal shopping time or services not used by the participant.",
          "In case of visa rejection, denied boarding, immigration rejection, deportation, customs restriction, documentation issue, legal problem or government action, no full refund is guaranteed.",
          "Refund processing timelines may vary depending on banks, payment gateways, hotels, airlines, visa offices, vendors and third-party service providers.",
        ],
      },
    ],
  },
  {
    id: "visa",
    title: "Visa Policy",
    sections: [
      {
        bullets: [
          "Sailx China provides visa assistance, not visa guarantee.",
          "Visa approval is fully subject to the decision of the Chinese Embassy, Consulate, Visa Center, immigration authority or relevant government department.",
          "Participants must submit correct, genuine and complete documents within the required deadline.",
          "Visa fees, service charges, invitation support charges, documentation charges, courier charges and administrative costs are non-refundable once processing begins.",
        ],
      },
    ],
    closing:
      "Sailx China shall not be responsible for visa rejection, delayed visa, denied boarding, immigration rejection, deportation, blacklisting, documentation discrepancy or government action.",
  },
];

export const POLICY_BY_ID = Object.fromEntries(
  POLICIES.map((p) => [p.id, p])
) as Record<PolicyId, Policy>;

export const POLICY_ROUTES: Record<PolicyId, string> = {
  payment: "/payment-policy",
  cancellation: "/cancellation-policy",
  refund: "/refund-policy",
  visa: "/visa-policy",
};
