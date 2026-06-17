"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@/lib/mock-data";
import { initials } from "@/lib/utils";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Manage your profile, company, billing, and preferences." />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{initials(currentUser.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Upload new photo</Button>
                  <div className="text-xs text-muted-foreground mt-1">JPG or PNG, max 2 MB</div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full name</Label>
                  <Input defaultValue={currentUser.name} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={currentUser.email} type="email" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue={currentUser.phone} />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input defaultValue={currentUser.country} />
                </div>
              </div>
              <Button variant="gradient">Save changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Company information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company name</Label>
                  <Input defaultValue={currentUser.company} />
                </div>
                <div className="space-y-2">
                  <Label>GST number</Label>
                  <Input defaultValue={currentUser.gst} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Billing address</Label>
                <Input placeholder="Street address" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <Input placeholder="City" />
                <Input placeholder="State" />
                <Input placeholder="Pincode" />
              </div>
              <Button variant="gradient">Save</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Notification preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "RFQ status updates", desc: "When status of any of your RFQs changes" },
                { label: "New quotations", desc: "When a supplier submits a quotation" },
                { label: "Shipment events", desc: "Departures, customs clearance, delivery" },
                { label: "New messages", desc: "From agents, suppliers, or admin" },
                { label: "Meeting reminders", desc: "30 mins before scheduled meetings" },
                { label: "Weekly digest", desc: "A summary of activity every Monday" }
              ].map((p, i) => (
                <div key={p.label}>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium text-sm">{p.label}</div>
                      <div className="text-xs text-muted-foreground">{p.desc}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground uppercase">Email</span>
                      <Switch defaultChecked />
                      <span className="text-[10px] text-muted-foreground uppercase">In-app</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  {i < 5 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Password</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Current password</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>New password</Label>
                <Input type="password" />
              </div>
              <Button variant="gradient">Update password</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Two-factor authentication</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Authenticator app</div>
                  <div className="text-xs text-muted-foreground">Add an extra layer of security to your account</div>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Connected accounts</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Google", desc: "Sign in, Calendar, Meet", connected: true },
                { name: "Slack", desc: "Send notifications to a channel", connected: false },
                { name: "Tally", desc: "Sync orders to Tally for accounting", connected: false },
                { name: "WhatsApp", desc: "Receive shipment alerts on WhatsApp", connected: false }
              ].map((int) => (
                <div key={int.name} className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{int.name}</div>
                      {int.connected && <Badge variant="success">Connected</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{int.desc}</div>
                  </div>
                  <Button variant={int.connected ? "outline" : "gradient"} size="sm">
                    {int.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
