import { useState, useEffect } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/services/apiClient";
import { Report } from "@/types/interfaces";
import { messages } from "@/i18n/messages";
import { toast } from "sonner";
import { formatters } from "@/utils/formatters";
import { Edit, Save, X, Send, FileCheck } from "lucide-react";

const Reportes = () => {
  const [activeTab, setActiveTab] = useState("mc01");
  const [reports, setReports] = useState<Record<string, Report>>({});
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalReport, setOriginalReport] = useState<Report | null>(null);

  const tabs = Array.from({ length: 14 }, (_, i) => `mc${String(i + 1).padStart(2, "0")}`);

  useEffect(() => {
    loadReport(activeTab);
  }, [activeTab]);

  const loadReport = async (tabId: string) => {
    if (reports[tabId]) {
      setCurrentReport(reports[tabId]);
      return;
    }

    const report = await apiClient.getReport(tabId);
    if (report) {
      setReports((prev) => ({ ...prev, [tabId]: report }));
      setCurrentReport(report);
    }
  };

  const handleEdit = () => {
    setOriginalReport(currentReport);
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (originalReport) {
      setCurrentReport(originalReport);
      setReports((prev) => ({ ...prev, [activeTab]: originalReport }));
    }
    setIsEditing(false);
    setOriginalReport(null);
  };

  const handleSave = async () => {
    if (!currentReport) return;

    const success = await apiClient.saveReport(currentReport);
    if (success) {
      setReports((prev) => ({ ...prev, [activeTab]: currentReport }));
      setIsEditing(false);
      setOriginalReport(null);
      toast.success(messages.reportes.successSave);
    }
  };

  const handleGenerate = () => {
    if (!currentReport) return;

    const previewHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${currentReport.subject}</h2>
        <div style="margin: 20px 0;">
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Estado</th>
              <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Cantidad</th>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Contenido</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${currentReport.content.length} caracteres</td>
            </tr>
          </table>
        </div>
        <div style="white-space: pre-line; margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #2196F3;">
          ${currentReport.content}
        </div>
        <hr style="margin: 20px 0;" />
        <div style="color: #666; font-size: 0.9em; white-space: pre-line;">
          ${currentReport.footer}
        </div>
      </div>
    `;

    setCurrentReport({ ...currentReport, previewHtml });
    toast.success(messages.reportes.successGenerate);
  };

  const handleSend = async () => {
    if (!currentReport) return;

    const payload = {
      reportId: currentReport.id,
      subject: currentReport.subject,
      body: currentReport.previewHtml || currentReport.content,
      recipients: currentReport.recipients,
      footer: currentReport.footer,
    };

    const success = await apiClient.sendReport(payload);
    if (success) {
      toast.success(messages.reportes.successSend);
      console.log("📧 Reporte enviado:", payload);
    } else {
      toast.error(messages.reportes.errorSend);
    }
  };

  if (!currentReport) return null;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{messages.reportes.title}</h1>
          <p className="text-muted-foreground text-lg">Generación y envío de reportes por correo</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap h-auto bg-muted">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab} 
                className="uppercase font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4 mt-6">
              <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
                  <CardTitle className="text-xl">Reporte {tab.toUpperCase()}</CardTitle>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button onClick={handleEdit} variant="outline" size="sm" className="font-medium">
                        <Edit className="h-4 w-4 mr-2" />
                        {messages.reportes.edit}
                      </Button>
                    ) : (
                      <>
                        <Button onClick={handleSave} variant="default" size="sm" className="font-medium">
                          <Save className="h-4 w-4 mr-2" />
                          {messages.reportes.save}
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm" className="font-medium">
                          <X className="h-4 w-4 mr-2" />
                          {messages.reportes.cancel}
                        </Button>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <Label className="text-sm font-semibold mb-2">{messages.reportes.content}</Label>
                    <Textarea
                      value={currentReport.content}
                      onChange={(e) =>
                        setCurrentReport({ ...currentReport, content: e.target.value })
                      }
                      disabled={!isEditing}
                      rows={6}
                      className="mt-2 resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-semibold mb-2">{messages.reportes.recipients}</Label>
                    <Input
                      value={formatters.joinEmails(currentReport.recipients)}
                      onChange={(e) =>
                        setCurrentReport({
                          ...currentReport,
                          recipients: formatters.splitEmails(e.target.value),
                        })
                      }
                      disabled={!isEditing}
                      className="mt-2 font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-semibold mb-2">{messages.reportes.subject}</Label>
                    <Input
                      value={currentReport.subject}
                      onChange={(e) =>
                        setCurrentReport({ ...currentReport, subject: e.target.value })
                      }
                      disabled={!isEditing}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-semibold mb-2">{messages.reportes.footer}</Label>
                    <Textarea
                      value={currentReport.footer}
                      onChange={(e) =>
                        setCurrentReport({ ...currentReport, footer: e.target.value })
                      }
                      disabled={!isEditing}
                      rows={3}
                      className="mt-2 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleGenerate} variant="secondary" className="font-medium">
                      <FileCheck className="h-4 w-4 mr-2" />
                      {messages.reportes.generateReport}
                    </Button>
                    <Button
                      onClick={handleSend}
                      variant="default"
                      disabled={!currentReport.previewHtml}
                      className="font-medium"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {messages.reportes.sendReport}
                    </Button>
                  </div>

                  {currentReport.previewHtml && (
                    <div className="border-t pt-6 mt-6">
                      <Label className="mb-3 block text-lg font-semibold">{messages.reportes.preview}</Label>
                      <div
                        className="border rounded-lg p-6 bg-card shadow-sm"
                        dangerouslySetInnerHTML={{ __html: currentReport.previewHtml }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reportes;
