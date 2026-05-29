import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NEWS = [
  {
    title: "Sunbelt rental demand up 6% YoY",
    source: "Estate AI Market Feed",
    time: "2h ago",
  },
  {
    title: "CT multifamily cap rates stabilize at 5.4%",
    source: "Regional Analytics",
    time: "5h ago",
  },
  {
    title: "Fed signals rate pause — investor sentiment improves",
    source: "Macro Brief",
    time: "1d ago",
  },
];

export function MarketNewsFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Market news</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {NEWS.map((item) => (
          <div key={item.title} className="border-b border-slate-100 pb-3 last:border-0">
            <p className="text-sm font-medium text-slate-900">{item.title}</p>
            <p className="mt-1 text-xs text-slate-500">
              {item.source} · {item.time}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
