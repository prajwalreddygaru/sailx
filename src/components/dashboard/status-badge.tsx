import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const map: Record<string, { label: string; variant: any; dot?: string }> = {
  DRAFT: { label: "Draft", variant: "muted", dot: "bg-muted-foreground" },
  PENDING: { label: "Pending", variant: "warning", dot: "bg-warning" },
  SOURCING: { label: "Sourcing", variant: "default", dot: "bg-primary" },
  QUOTATIONS_RECEIVED: { label: "Quotations", variant: "default", dot: "bg-primary" },
  SAMPLE_STAGE: { label: "Sample", variant: "default", dot: "bg-purple-500" },
  PRODUCTION: { label: "Production", variant: "warning", dot: "bg-warning" },
  SHIPPING: { label: "Shipping", variant: "default", dot: "bg-blue-500" },
  DELIVERED: { label: "Delivered", variant: "success", dot: "bg-success" },
  CANCELLED: { label: "Cancelled", variant: "destructive", dot: "bg-destructive" },
  // Order
  CONFIRMED: { label: "Confirmed", variant: "default", dot: "bg-primary" },
  IN_PRODUCTION: { label: "In Production", variant: "warning", dot: "bg-warning" },
  READY_TO_SHIP: { label: "Ready to Ship", variant: "default", dot: "bg-blue-500" },
  SHIPPED: { label: "Shipped", variant: "default", dot: "bg-blue-500" },
  // Shipment
  PREPARING: { label: "Preparing", variant: "muted", dot: "bg-muted-foreground" },
  PICKED_UP: { label: "Picked up", variant: "default", dot: "bg-primary" },
  IN_TRANSIT: { label: "In Transit", variant: "default", dot: "bg-blue-500" },
  AT_PORT: { label: "At Port", variant: "default", dot: "bg-purple-500" },
  CUSTOMS: { label: "Customs", variant: "warning", dot: "bg-warning" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", variant: "default", dot: "bg-blue-500" },
  // Quotation
  ACCEPTED: { label: "Accepted", variant: "success", dot: "bg-success" },
  REJECTED: { label: "Rejected", variant: "destructive", dot: "bg-destructive" },
  NEGOTIATING: { label: "Negotiating", variant: "warning", dot: "bg-warning" },
  // Sample
  REQUESTED: { label: "Requested", variant: "muted", dot: "bg-muted-foreground" },
  APPROVED: { label: "Approved", variant: "success", dot: "bg-success" },
  // Payment
  PARTIAL: { label: "Partial", variant: "warning", dot: "bg-warning" },
  PAID: { label: "Paid", variant: "success", dot: "bg-success" }
};

export function StatusBadge({ status }: { status: string }) {
  const m = map[status] || { label: status, variant: "muted", dot: "bg-muted-foreground" };
  return (
    <Badge variant={m.variant} className="gap-1.5 capitalize">
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.label}
    </Badge>
  );
}
