"use client";

import { Check, Bell, FileText, BarChart3, Ship, MessageSquare, Video } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { notifications } from "@/lib/mock-data";
import { timeAgo, cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  RFQ: FileText,
  QUOTATION: BarChart3,
  SHIPMENT: Ship,
  MESSAGE: MessageSquare,
  MEETING: Video,
  SYSTEM: Bell
};

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay on top of every RFQ update, quotation, shipment, and conversation."
        actions={
          <Button variant="outline" size="sm">
            <Check className="h-3.5 w-3.5" /> Mark all read
          </Button>
        }
      />
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="rfq">RFQ</TabsTrigger>
          <TabsTrigger value="shipment">Shipments</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            {notifications.map((n, i) => {
              const Icon = iconMap[n.type] || Bell;
              return (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-start gap-3 p-4",
                    i < notifications.length - 1 && "border-b",
                    !n.read && "bg-primary/[0.03]"
                  )}
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-medium text-sm">{n.title}</div>
                      <Badge variant="muted" className="text-[9px] capitalize">{n.type.toLowerCase()}</Badge>
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">{n.message}</div>
                    <div className="text-[10px] text-muted-foreground mt-1.5">{timeAgo(n.createdAt)}</div>
                  </div>
                </div>
              );
            })}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
