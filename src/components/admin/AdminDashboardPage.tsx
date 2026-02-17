import { useEffect, useMemo, useRef } from "react";
import { Card } from "@/components/ui/card";
import Chart from "chart.js/auto";
import { useGetDashboardQuery } from "@/features/admin/adminApi";
import {
  AlertTriangle,
  BarChart3,
  Download,
  Layers,
  MessageSquare,
  Share2,
  Users,
} from "lucide-react";

const fallbackStats = [
  { label: "Uploads", value: "0", icon: Layers },
  { label: "Users", value: "0", icon: Users },
  { label: "Comments", value: "0", icon: MessageSquare },
  { label: "Shares", value: "0", icon: Share2 },
  { label: "Alerts", value: "0", icon: AlertTriangle },
];

const activityRows = [
  { action: "Video Upload", actor: "admin@sayeri.com", time: "10 sec ago", state: "Completed" },
  { action: "Category Update", actor: "admin@sayeri.com", time: "45 sec ago", state: "Completed" },
  { action: "Comment Review", actor: "mod@sayeri.com", time: "2 min ago", state: "Pending" },
  { action: "Memory Cleanup", actor: "system", time: "4 min ago", state: "Running" },
  { action: "Transcode Queue", actor: "system", time: "6 min ago", state: "Completed" },
  { action: "Safety Scan", actor: "system", time: "9 min ago", state: "Running" },
];

const metricBars = [
  { label: "CPU", value: 58 },
  { label: "RAM", value: 71 },
  { label: "Queue", value: 33 },
  { label: "Storage", value: 46 },
];

export default function AdminDashboardPage() {
  const { data: dashboard } = useGetDashboardQuery();
  const lineChartRef = useRef<HTMLCanvasElement | null>(null);
  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const doughnutChartRef = useRef<HTMLCanvasElement | null>(null);

  const labels = useMemo(() => dashboard?.trends?.labels ?? [], [dashboard?.trends?.labels]);
  const shareSeries = dashboard?.trends?.shares ?? [];
  const downloadSeries = dashboard?.trends?.downloads ?? [];
  const statItems = useMemo(() => {
    if (!dashboard?.totals) return fallbackStats;
    return [
      { label: "Uploads", value: String(dashboard.totals.uploads ?? 0), icon: Layers },
      { label: "Users", value: String(dashboard.totals.users ?? 0), icon: Users },
      { label: "Comments", value: String(dashboard.totals.comments ?? 0), icon: MessageSquare },
      { label: "Shares", value: String(dashboard.totals.shares ?? 0), icon: Share2 },
      { label: "Alerts", value: String(dashboard.totals.alerts ?? 0), icon: AlertTriangle },
    ];
  }, [dashboard?.totals]);
  const engagementValues = useMemo(
    () => [
      dashboard?.engagement?.likes ?? 0,
      dashboard?.engagement?.shares ?? 0,
      dashboard?.engagement?.comments ?? 0,
      dashboard?.engagement?.downloads ?? 0,
    ],
    [dashboard?.engagement]
  );
  const engagementTotal = useMemo(
    () => engagementValues.reduce((sum, value) => sum + value, 0),
    [engagementValues]
  );

  useEffect(() => {
    if (!lineChartRef.current || !barChartRef.current || !doughnutChartRef.current) return;

    const lineChart = new Chart(lineChartRef.current, {
      type: "line",
      data: {
        labels: labels.length ? labels : ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
        datasets: [
          {
            label: "Shares",
            data: shareSeries.length ? shareSeries : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: "hsl(222.2 84% 4.9%)",
            backgroundColor: "hsla(222.2, 84%, 4.9%, 0.1)",
            tension: 0.3,
            fill: true,
            pointRadius: 2,
          },
          {
            label: "Downloads",
            data: downloadSeries.length ? downloadSeries : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: "hsl(240 3.8% 46.1%)",
            backgroundColor: "hsla(240, 3.8%, 46.1%, 0.08)",
            tension: 0.3,
            fill: true,
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, labels: { boxWidth: 8, boxHeight: 8 } },
          tooltip: { enabled: true },
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "hsla(240, 3.8%, 46.1%, 0.2)" } },
        },
      },
    });

    const barChart = new Chart(barChartRef.current, {
      type: "bar",
      data: {
        labels: dashboard?.categories?.map((cat) => cat.label) ?? ["Videos"],
        datasets: [
          {
            label: "Plays",
            data: dashboard?.categories?.map((cat) => cat.value) ?? [0],
            backgroundColor: "hsl(222.2 84% 4.9%)",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "hsla(240, 3.8%, 46.1%, 0.2)" } },
        },
      },
    });

    const doughnutChart = new Chart(doughnutChartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Likes", "Shares", "Comments", "Downloads"],
        datasets: [
          {
            data: engagementValues,
            backgroundColor: [
              "hsl(222.2 84% 4.9%)",
              "hsl(240 3.8% 46.1%)",
              "hsl(240 5% 64.9%)",
              "hsl(240 6% 90%)",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
        cutout: "70%",
      },
    });

    return () => {
      lineChart.destroy();
      barChart.destroy();
      doughnutChart.destroy();
    };
  }, [labels, shareSeries, downloadSeries, dashboard?.categories, engagementValues]);

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {statItems.map((item) => (
          <Card key={item.label} className="rounded-xl border border-border bg-card p-3 shadow-sm">
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
              <span>{item.label}</span>
              <item.icon className="h-4 w-4" />
            </div>
            <div className="mt-1 text-lg font-bold text-foreground">{item.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <BarChart3 className="h-3.5 w-3.5" />
                Video Analytics
              </div>
              <div className="min-h-[160px] w-full rounded-lg border border-border bg-background p-2 sm:min-h-[200px]">
                <canvas ref={lineChartRef} className="block h-full w-full max-w-full" />
              </div>
            </div>

            <div className="rounded-xl border border-border p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Share2 className="h-3.5 w-3.5" />
                Engagement Mix
              </div>
              <div className="grid min-h-[160px] place-items-center sm:min-h-[200px]">
                <div className="relative aspect-square w-full max-w-[160px]">
                  <canvas ref={doughnutChartRef} className="block h-full w-full max-w-full" />
                  <div className="absolute inset-0 grid place-items-center text-xs font-bold">
                    {engagementTotal}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                {["Likes", "Shares", "Comments", "Downloads"].map((label, index) => (
                  <div key={label} className="flex items-center gap-1">
                    <span
                      className="inline-flex h-2 w-2 rounded-full"
                      style={{
                        backgroundColor:
                          index === 0
                            ? "hsl(222.2 84% 4.9%)"
                            : index === 1
                              ? "hsl(240 3.8% 46.1%)"
                              : index === 2
                                ? "hsl(240 5% 64.9%)"
                                : "hsl(240 6% 90%)",
                      }}
                    />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Layers className="h-3.5 w-3.5" />
              Plays By Category
            </div>
            <div className="min-h-[160px] w-full rounded-lg border border-border bg-background p-2 sm:min-h-[200px]">
              <canvas ref={barChartRef} className="block h-full w-full max-w-full" />
            </div>
          </div>

          <div className="rounded-xl border border-border">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide">
              <AlertTriangle className="h-3.5 w-3.5" />
              System Actions (Realtime)
            </div>
            <div className="w-full overflow-x-auto">
              <div className="divide-y divide-border">
                {activityRows.map((row) => (
                  <div
                    key={`${row.action}-${row.time}`}
                    className="grid grid-cols-1 gap-1 px-3 py-2 text-xs sm:grid-cols-[1.5fr_1.4fr_1fr_1fr] sm:gap-0"
                  >
                    <span>{row.action}</span>
                    <span className="truncate">{row.actor}</span>
                    <span>{row.time}</span>
                    <span
                      className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        row.state === "Completed"
                          ? "bg-foreground text-background"
                          : row.state === "Running"
                            ? "bg-muted text-foreground"
                            : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {row.state}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="w-full min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
            <Download className="h-4 w-4" />
            Analytics and Memory Usage
          </h3>
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
