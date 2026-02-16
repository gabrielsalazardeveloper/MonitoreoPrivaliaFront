import { useEffect, useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/services/apiClient";
import { DashboardData } from "@/types/interfaces";
import { messages } from "@/i18n/messages";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, Clock, CheckCircle2, Loader2 } from "lucide-react";

const COLORS = ["hsl(217, 91%, 45%)", "hsl(38, 92%, 50%)", "hsl(142, 76%, 36%)"];

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await apiClient.getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!data) return null;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {messages.dashboard.title}
          </h1>
          <p className="text-muted-foreground text-lg">{messages.dashboard.subtitle}</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md border-l-4 border-l-destructive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {messages.dashboard.erroresReportados}
              </CardTitle>
              <AlertCircle className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-destructive">{data.erroresReportados}</div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {messages.dashboard.pendientesPorRespuesta}
              </CardTitle>
              <Clock className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-warning">{data.pendientesPorRespuesta}</div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {messages.dashboard.reportesSolucionados}
              </CardTitle>
              <CheckCircle2 className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-success">{data.reportesSolucionados}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg">{messages.dashboard.chartTitle}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="errores" fill="hsl(0, 84%, 60%)" name="Errores" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pendientes" fill="hsl(38, 92%, 50%)" name="Pendientes" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="solucionados" fill="hsl(142, 76%, 36%)" name="Solucionados" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg">{messages.dashboard.pieChartTitle}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
