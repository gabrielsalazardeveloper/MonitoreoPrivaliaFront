import { useState, useEffect } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/services/apiClient";
import { Job, Observation } from "@/types/interfaces";
import { messages } from "@/i18n/messages";
import { toast } from "sonner";
import { formatters } from "@/utils/formatters";
import { Save, Plus, RefreshCw } from "lucide-react";
import { localState } from "@/utils/localState";

const Jobs = () => {
  const [activeTab, setActiveTab] = useState("job-1");
  const [jobs, setJobs] = useState<Record<string, Job>>({});
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [newObservation, setNewObservation] = useState("");
  const [iframeKey, setIframeKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const observationsPerPage = 5;

  const tabs = Array.from({ length: 10 }, (_, i) => `job-${i + 1}`);
  const user = localState.getUserData();

  useEffect(() => {
    loadJob(activeTab);
    setCurrentPage(1); // Reset to first page when changing tabs
  }, [activeTab]);

  const loadJob = async (jobId: string) => {
    if (jobs[jobId]) {
      setCurrentJob(jobs[jobId]);
      return;
    }

    const job = await apiClient.getJob(jobId);
    if (job) {
      setJobs((prev) => ({ ...prev, [jobId]: job }));
      setCurrentJob(job);
    }
  };

  const handleSave = async () => {
    if (!currentJob) return;

    const success = await apiClient.saveJob(currentJob);
    if (success) {
      setJobs((prev) => ({ ...prev, [activeTab]: currentJob }));
      toast.success(messages.jobs.successSave);
    } else {
      toast.error(messages.jobs.errorSave);
    }
  };

  const handleAddObservation = async () => {
    if (!currentJob || !newObservation.trim()) return;

    const observation: Observation = {
      id: `obs-${Date.now()}`,
      user: user?.name || "Usuario",
      text: newObservation,
      datetime: new Date().toISOString(),
    };

    const success = await apiClient.addObservation(currentJob.id, observation);
    if (success) {
      const updatedJob = {
        ...currentJob,
        observations: [observation, ...currentJob.observations], // Add to beginning
      };
      setCurrentJob(updatedJob);
      setJobs((prev) => ({ ...prev, [activeTab]: updatedJob }));
      setNewObservation("");
      setCurrentPage(1); // Reset to first page to see new observation
      toast.success(messages.jobs.successObservation);
    }
  };

  const handleUpdateFrame = () => {
    setIframeKey((prev) => prev + 1);
    toast.success("Frame actualizado");
  };

  if (!currentJob) return null;

  // Sort observations by datetime descending (most recent first)
  const sortedObservations = [...currentJob.observations].sort(
    (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
  );

  // Calculate pagination
  const totalPages = Math.ceil(sortedObservations.length / observationsPerPage);
  const startIndex = (currentPage - 1) * observationsPerPage;
  const endIndex = startIndex + observationsPerPage;
  const paginatedObservations = sortedObservations.slice(startIndex, endIndex);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{messages.jobs.title}</h1>
          <p className="text-muted-foreground text-lg">{messages.jobs.subtitle}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap h-auto bg-muted">
            {tabs.map((tab, idx) => (
              <TabsTrigger 
                key={tab} 
                value={tab}
                className="data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium"
              >
                Job {idx + 1}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-6 mt-6">
              <Card className="shadow-md">
                <CardHeader className="border-b bg-muted/30">
                  <CardTitle className="text-xl">{currentJob.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <Label className="text-sm font-semibold mb-2">{messages.jobs.url}</Label>
                    <Input
                      value={currentJob.url}
                      onChange={(e) =>
                        setCurrentJob({ ...currentJob, url: e.target.value })
                      }
                      placeholder="https://ejemplo.com"
                      className="mt-2 font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-semibold mb-2">{messages.jobs.description}</Label>
                    <Textarea
                      value={currentJob.description}
                      onChange={(e) =>
                        setCurrentJob({ ...currentJob, description: e.target.value })
                      }
                      rows={3}
                      className="mt-2 resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-semibold mb-2">{messages.jobs.observations}</Label>
                    <Textarea
                      value={newObservation}
                      onChange={(e) => setNewObservation(e.target.value)}
                      rows={2}
                      placeholder="Escribe una nueva observación..."
                      className="mt-2 resize-none"
                    />
                    <Button
                      onClick={handleAddObservation}
                      variant="secondary"
                      size="sm"
                      className="mt-3 font-medium"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {messages.jobs.addObservation}
                    </Button>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleSave} variant="default" className="font-medium">
                      <Save className="h-4 w-4 mr-2" />
                      {messages.jobs.saveJob}
                    </Button>
                    <Button onClick={handleUpdateFrame} variant="outline" className="font-medium">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {messages.jobs.updateFrame}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-md">
                  <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="text-lg">{messages.jobs.historico}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {paginatedObservations.length > 0 ? (
                        paginatedObservations.map((obs) => (
                          <div key={obs.id} className="border-l-4 border-primary pl-4 py-3 bg-card hover:bg-muted/50 transition-colors rounded-r shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-semibold text-sm text-foreground">{obs.user}</span>
                              <span className="text-xs text-muted-foreground font-medium">
                                {formatters.formatDateTime(obs.datetime)}
                              </span>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">{obs.text}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          No hay observaciones registradas
                        </div>
                      )}
                    </div>
                    
                    {totalPages > 1 && (
                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <div className="text-sm text-muted-foreground font-medium">
                          Página {currentPage} de {totalPages}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="font-medium"
                          >
                            Anterior
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="font-medium"
                          >
                            Siguiente
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="text-lg">{messages.jobs.vistaPrevia}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {currentJob.url ? (
                      <iframe
                        key={iframeKey}
                        src={currentJob.url}
                        className="w-full h-96 border rounded shadow-sm"
                        sandbox="allow-same-origin allow-scripts"
                        title="Job Preview"
                      />
                    ) : (
                      <div className="w-full h-96 border rounded flex items-center justify-center bg-muted/30">
                        <p className="text-muted-foreground font-medium">
                          No hay URL configurada
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Jobs;
