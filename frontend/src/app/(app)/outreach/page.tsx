"use client";

import { Play, Pause, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOSStore } from "@/store/use-os-store";

export default function OutreachPage() {
  const campaigns = useOSStore((s) => s.campaigns);
  const toggleCampaign = useOSStore((s) => s.toggleCampaign);
  const runCampaignCycle = useOSStore((s) => s.runCampaignCycle);

  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalReplies = campaigns.reduce((sum, c) => sum + c.replies, 0);
  const openRate = totalSent > 0 ? (totalReplies / totalSent) * 100 : 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Outreach Automation</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">AI Sequence Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="rounded-md bg-muted/50 p-3">Open rate: {openRate.toFixed(1)}%</div>
            <div className="rounded-md bg-muted/50 p-3">Reply count: {totalReplies}</div>
            <div className="rounded-md bg-muted/50 p-3">Messages sent: {totalSent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-md border border-border p-2">
                <p className="font-medium text-foreground">{campaign.name}</p>
                <p className="mt-1">Sent {campaign.sent} · Replies {campaign.replies}</p>
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-[11px]"
                    onClick={() => toggleCampaign(campaign.id)}
                  >
                    {campaign.status === "running" ? (
                      <>
                        <Pause className="h-3 w-3" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" /> Resume
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-[11px]"
                    onClick={() => runCampaignCycle(campaign.id)}
                  >
                    <RefreshCcw className="h-3 w-3" />
                    Run
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
