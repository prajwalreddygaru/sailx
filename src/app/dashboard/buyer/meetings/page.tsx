"use client";

import { Plus, Video, Calendar, Clock, Users, ExternalLink, Copy } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";
import { toast } from "sonner";

const upcoming = [
  {
    id: "m1",
    title: "TWS Earbuds — Quotation review",
    date: "Tomorrow",
    time: "11:00 AM IST · 30 min",
    attendees: ["Li Wei", "Arjun Mehta"],
    rfq: "RFQ-2026-0184",
    link: "https://meet.google.com/abc-defg-hij"
  },
  {
    id: "m2",
    title: "EcoPack factory tour (live)",
    date: "Fri, 28 May",
    time: "2:30 PM IST · 1 hour",
    attendees: ["Chen Hua", "Arjun Mehta", "Quality team"],
    rfq: "RFQ-2026-0179",
    link: "https://meet.google.com/xyz-vwxy-zab"
  }
];

const past = [
  {
    id: "p1",
    title: "Kickoff with sourcing pod",
    date: "Mon, 19 May",
    time: "10:00 AM IST",
    attendees: ["Li Wei", "Chen Hua", "Arjun Mehta"],
    rfq: "—"
  }
];

export default function MeetingsPage() {
  return (
    <div>
      <PageHeader
        title="Meetings"
        description="Schedule Google Meet calls with your sourcing agents — synced with your calendar."
        actions={
          <Button variant="gradient" size="sm">
            <Plus className="h-4 w-4" /> Schedule meeting
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Upcoming
            </div>
            <div className="space-y-3">
              {upcoming.map((m) => (
                <Card key={m.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-1 bg-gradient-to-b from-brand-400 to-brand-700" />
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-semibold">{m.title}</div>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {m.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {m.time}
                            </span>
                            <Badge variant="muted" className="text-[10px]">{m.rfq}</Badge>
                          </div>
                        </div>
                        <Button variant="gradient" size="sm">
                          <Video className="h-3.5 w-3.5" /> Join
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {m.attendees.slice(0, 3).map((a) => (
                              <Avatar key={a} className="h-7 w-7 ring-2 ring-background">
                                <AvatarFallback className="text-[10px]">{initials(a)}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{m.attendees.join(", ")}</span>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(m.link);
                            toast.success("Meeting link copied");
                          }}
                          className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" /> Copy link
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Past
            </div>
            <div className="space-y-3">
              {past.map((m) => (
                <Card key={m.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{m.title}</div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{m.date}</span>
                        <span>·</span>
                        <span>{m.attendees.length} attendees</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View recap</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Schedule a meeting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              SailX integrates with Google Calendar and creates Google Meet
              links automatically.
            </p>
            <Button variant="gradient" className="w-full">
              <Video className="h-4 w-4" /> Create Google Meet
            </Button>
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4" /> Connect Google Calendar
            </Button>
            <div className="pt-3 border-t text-xs text-muted-foreground">
              Set <span className="font-mono">GOOGLE_CLIENT_ID</span> and <span className="font-mono">GOOGLE_CLIENT_SECRET</span> in your env to enable live meet creation.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
