"use client";

import * as React from "react";
import { IndianRupee, CreditCard, CheckCircle2, Clock, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface QuotationAttachment {
  type: "quotation";
  orderId: string;
  orderCode: string;
  productTitle: string;
  productImage?: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface QuotationCardProps {
  quotation: QuotationAttachment;
  mine: boolean;
  /** Set for buyer view — paid order IDs so we know if already paid */
  paidOrderIds?: Set<string>;
  onPay?: (orderId: string) => Promise<void>;
  paying?: boolean;
}

export function QuotationCard({ quotation, mine, paidOrderIds, onPay, paying }: QuotationCardProps) {
  const isPaid = paidOrderIds?.has(quotation.orderId);

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden border shadow-md w-[280px]",
        mine ? "border-primary/30 bg-primary/5" : "border-border bg-card"
      )}
    >
      {/* Product image banner */}
      {quotation.productImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={quotation.productImage}
          alt={quotation.productTitle}
          className="w-full h-32 object-cover"
        />
      ) : (
        <div className="w-full h-24 flex items-center justify-center bg-muted">
          <Package className="h-8 w-8 text-muted-foreground opacity-40" />
        </div>
      )}

      {/* Content */}
      <div className="p-3 space-y-2.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-sm leading-tight line-clamp-2">{quotation.productTitle}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{quotation.orderCode}</p>
          </div>
          <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-0.5">
            <Clock className="h-2.5 w-2.5" /> Quote
          </span>
        </div>

        {/* Qty + Price */}
        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            Qty: <span className="font-medium text-foreground">{quotation.quantity}</span>
          </div>
          <div className="flex items-center gap-0.5 font-bold text-lg text-primary">
            <IndianRupee className="h-4 w-4" />
            {quotation.price.toLocaleString("en-IN")}
          </div>
        </div>

        {/* Notes */}
        {quotation.notes && (
          <p className="text-[11px] text-muted-foreground italic border-l-2 border-primary/30 pl-2">
            {quotation.notes}
          </p>
        )}

        {/* Action: buyer Pay Now / agent status */}
        {onPay && !mine && (
          isPaid ? (
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold pt-1">
              <CheckCircle2 className="h-4 w-4" /> Payment Received
            </div>
          ) : (
            <Button
              size="sm"
              className="w-full h-8 text-xs bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 gap-1.5 mt-1"
              onClick={() => onPay(quotation.orderId)}
              disabled={paying}
            >
              {paying
                ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Opening…</>
                : <><CreditCard className="h-3.5 w-3.5" /> Pay ₹{quotation.price.toLocaleString("en-IN")} via UPI</>
              }
            </Button>
          )
        )}

        {/* Agent sees status instead of button */}
        {mine && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border/50">
            {isPaid
              ? <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /><span className="text-emerald-400 font-medium">Buyer paid</span></>
              : <><Clock className="h-3.5 w-3.5" /> Awaiting buyer payment</>
            }
          </div>
        )}
      </div>
    </div>
  );
}
