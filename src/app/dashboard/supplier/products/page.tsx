"use client";

import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { productCategories } from "@/lib/mock-data";

const products = [
  { id: 1, name: "TWS Earbuds Pro X1", category: "Electronics", moq: 1000, leadTime: "30 days", price: 8.40, image: productCategories[0].image, status: "Active" },
  { id: 2, name: "Wireless Speaker BoomBox", category: "Electronics", moq: 500, leadTime: "25 days", price: 14.20, image: productCategories[0].image, status: "Active" },
  { id: 3, name: "Kraft Mailer Box", category: "Packaging", moq: 5000, leadTime: "20 days", price: 0.42, image: productCategories[1].image, status: "Active" },
  { id: 4, name: "Smart LED Strip 5m", category: "Electronics", moq: 2000, leadTime: "35 days", price: 3.80, image: productCategories[0].image, status: "Draft" },
  { id: 5, name: "Industrial Bearings 6204ZZ", category: "Industrial", moq: 1000, leadTime: "15 days", price: 1.20, image: productCategories[2].image, status: "Active" },
  { id: 6, name: "Ceramic Vase Trio", category: "Home Decor", moq: 500, leadTime: "40 days", price: 7.20, image: productCategories[4].image, status: "Active" }
];

export default function ProductsPage() {
  return (
    <div>
      <PageHeader
        title="Product catalog"
        description="Showcase your products with MOQs, lead times, and pricing."
        actions={<Button variant="gradient" size="sm"><Plus className="h-4 w-4" /> Add product</Button>}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <div className="aspect-[4/3] bg-muted overflow-hidden">
              <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="font-medium leading-tight">{p.name}</div>
                <Badge variant={p.status === "Active" ? "success" : "muted"} className="shrink-0">
                  {p.status}
                </Badge>
              </div>
              <Badge variant="muted" className="text-[10px]">{p.category}</Badge>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t text-xs">
                <div>
                  <div className="text-muted-foreground">MOQ</div>
                  <div className="font-medium">{p.moq.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Lead</div>
                  <div className="font-medium">{p.leadTime}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Price</div>
                  <div className="font-medium">${p.price}</div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3" /> Edit
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
