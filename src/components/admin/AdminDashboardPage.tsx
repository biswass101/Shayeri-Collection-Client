import { Card } from "@/components/ui/card";

const statItems = [
  { label: "Uploads", value: "128" },
  { label: "Users", value: "5.4K" },
  { label: "Comments", value: "19K" },
  { label: "Shares", value: "8.2K" },
  { label: "Alerts", value: "12" },
];

const trendValues = [32, 44, 38, 52, 49, 61, 58, 74, 70, 82];

const activityRows = [
  { action: "Video Upload", actor: "admin@sayeri.com", time: "10 sec ago", state: "Completed" },
  { action: "Category Update", actor: "admin@sayeri.com", time: "45 sec ago", state: "Completed" },
  { action: "Comment Review", actor: "mod@sayeri.com", time: "2 min ago", state: "Pending" },
  { action: "Memory Cleanup", actor: "system", time: "4 min ago", state: "Running" },
];

const metricBars = [
  { label: "CPU", value: 58 },
  { label: "RAM", value: 71 },
  { label: "Queue", value: 33 },
  { label: "Storage", value: 46 },
];

export default function AdminDashboardPage() {
  const polylinePoints = trendValues
    .map((value, index) => {
      const x = (index / (trendValues.length - 1)) * 100;
      const y = 100 - value;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        {statItems.map((item) => (
          <Card key={item.label} className="rounded-xl border border-border bg-card p-3 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</div>
            <div className="mt-1 text-lg font-bold text-foreground">{item.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Graphs</div>
              <div className="h-40 rounded-lg border border-border bg-background p-2">
                <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-foreground"
                    points={polylinePoints}
                  />
                </svg>
              </div>
            </div>

            <div className="rounded-xl border border-border p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Chats</div>
              <div className="grid h-40 place-items-center">
                <div className="relative h-24 w-24 rounded-full bg-[conic-gradient(hsl(var(--foreground))_0deg,hsl(var(--foreground))_216deg,hsl(var(--muted))_216deg,hsl(var(--muted))_360deg)]">
                  <div className="absolute inset-3 grid place-items-center rounded-full bg-background text-xs font-bold">
                    60%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border">
            <div className="border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide">
              System Actions (Realtime)
            </div>
            <div className="divide-y divide-border">
              {activityRows.map((row) => (
                <div key={`${row.action}-${row.time}`} className="grid grid-cols-[1.5fr_1.4fr_1fr_1fr] px-3 py-2 text-xs">
                  <span>{row.action}</span>
                  <span className="truncate">{row.actor}</span>
                  <span>{row.time}</span>
                  <span className="font-semibold">{row.state}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Analytics and Memory Usage</h3>
          <div className="mt-4 space-y-4">
            {metricBars.map((metric) => (
              <div key={metric.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span>{metric.label}</span>
                  <span>{metric.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-foreground"
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-border p-3">
            <div className="text-xs font-semibold uppercase tracking-wide">Bandwidth Trend</div>
            <div className="mt-3 grid grid-cols-8 items-end gap-1">
              {[28, 36, 22, 44, 31, 53, 48, 58].map((bar, index) => (
                <div key={index} className="h-16 rounded-sm bg-muted">
                  <div className="w-full rounded-sm bg-foreground" style={{ height: `${bar}%` }} />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
